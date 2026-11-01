"""Unconditional 64x64 face diffusion model on CelebA, plus SDEdit variations of your own photos.

Training data: CelebA aligned faces (202,599 images) from the Hugging Face hub (nielsr/CelebA-faces),
center-cropped to 140x140 and resized to 64x64, the standard CelebA-64 preprocessing. The first run
preprocesses everything into DATA_CACHE (~2.5GB) and later runs load that directly.
CelebA is licensed for non-commercial research use only.

Variations (SDEdit, Meng et al. 2021): each photo in MY_PHOTOS_DIR is face-detected, aligned to the
average CelebA face position, noised part of the way (STRENGTH) and denoised by the model. Low strength
stays close to your photo; high strength keeps only the rough layout and lets the model reimagine the face.

Reuses the U-Net, noise schedule and logging from bubble_diffusion.py (the U-Net's label embeddings
are given zero classes, so they reduce to a constant learned bias).

Extra dependencies:  pip install datasets opencv-python

Edit the settings below, set MODE, then run:  python src/face_diffusion.py
"""

import copy
import json
import math
import time
import urllib.request
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import torch
import torch.nn.functional as F
from PIL import Image
from torchvision.utils import save_image

from src.bubble_diffusion import UNet, cosine_alpha_bars, get_device, log, save_loss_curve, setup_logging

MODE = "variations"  # "train", "sample" or "variations"

# ---- data
HF_DATASET = "nielsr/CelebA-faces"
DATA_CACHE = "data/celeba64.pt"  # preprocessed uint8 faces, built on first run
MAX_IMAGES = None  # e.g. 2000 for a quick test (streams only that many instead of downloading everything)
IMAGE_SIZE = 64
CROP = 140  # center crop of the 178x218 aligned CelebA images before resizing
OUT_DIR = "runs/face_diffusion"  # train.log, loss_log.csv, checkpoints and figs

# ---- model (~40M params; attention at 16x16 and 8x8)
BASE_CH = 128
CH_MULT = (1, 2, 2, 2)
NUM_RES_BLOCKS = 2
ATTN_LEVELS = (2, 3)
DROPOUT = 0.1
TIMESTEPS = 1000

# ---- training
EPOCHS = 150  # one epoch = ~1580 steps at batch 128, so ~240k steps total
BATCH_SIZE = 128
LR = 1e-4
WARMUP = 1000
EMA_DECAY = 0.9999
FLIP = True  # random horizontal flips
DATA_ON_GPU = True  # keep all ~2.5GB of faces on the GPU (set False on small GPUs)
LOG_EVERY = 1  # epochs between loss lines in train.log
FIG_EVERY = 5  # epochs between sample grids + loss curve in OUT_DIR/figs
CKPT_EVERY = 10  # epochs between checkpoints: ckpt.pt (latest, resumable) + checkpoints/ema_epoch_XXXX.pt (kept)
RESUME = None  # path to a ckpt.pt to continue training from
COMPILE = False  # torch.compile the model (CUDA only, faster after warmup)

# ---- sample / variations
CKPT_PATH = f"{OUT_DIR}/ckpt.pt"  # or a kept one, e.g. f"{OUT_DIR}/checkpoints/ema_epoch_0150.pt"
DDIM_STEPS = 100  # for a full generation from noise; variations use STRENGTH * DDIM_STEPS
SEED = 0
N_SAMPLES = 64  # random faces in "sample" mode
SAMPLE_OUT_DIR = "outputs/face_samples"
MY_PHOTOS_DIR = "my_photos"  # your photos (.jpg/.png); one clear, roughly frontal face each works best
VARIATIONS_OUT_DIR = "outputs/face_variations"
STRENGTHS = (0.2, 0.35, 0.5, 0.65, 0.8)  # fraction of the noise schedule to jump into; one row per strength
N_VARIATIONS = 16  # different noise draws per strength
SEPARATOR_PX = 4  # white gap after the photo column and between photos in the mega plot (variations themselves touch)
FIG_SCALE = 2  # figure pixels per image pixel
# Shuffled mega plot: every photo and variation in random order, no labels or gaps (all_variations_shuffled.png)
SHUFFLED_COLS = None  # tiles per row; None = as close to square as possible
SHUFFLED_FLIP = True  # randomly mirror tiles for extra chaos
SHUFFLED_UPSCALE = 8  # output pixels per image pixel (8 -> 512px per face, enough to print)
SHUFFLED_RESAMPLE = "lanczos"  # "lanczos" (smooth) or "nearest" (blocky pixels)
SHUFFLED_SEED = None  # None = a different arrangement every run
YUNET_URL = "https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx"
YUNET_PATH = "data/face_detection_yunet_2023mar.onnx"
TEMPLATE_PATH = f"{OUT_DIR}/landmark_template.json"  # average CelebA landmarks, computed once from DATA_CACHE

IMG_EXTS = {".png", ".jpg", ".jpeg", ".bmp", ".webp"}


# ---------------------------------------------------------------- data

def preprocess_celeba(img):
    w, h = img.size
    left, top = (w - CROP) // 2, (h - CROP) // 2
    img = img.convert("RGB").crop((left, top, left + CROP, top + CROP))
    return np.asarray(img.resize((IMAGE_SIZE, IMAGE_SIZE), Image.LANCZOS), dtype=np.uint8)


def load_faces():
    """uint8 [N, 3, H, W] CelebA faces, built from the Hugging Face dataset and cached on first use."""
    cache = Path(DATA_CACHE)
    if cache.exists():
        images = torch.load(cache)
        log.info(f"loaded {len(images)} faces from {cache}")
        return images

    from datasets import load_dataset

    if MAX_IMAGES:
        ds = load_dataset(HF_DATASET, split="train", streaming=True).take(MAX_IMAGES)
        total = MAX_IMAGES
    else:
        ds = load_dataset(HF_DATASET, split="train")
        total = len(ds)
    log.info(f"preprocessing {total} faces from {HF_DATASET} (one-time, cached to {cache})")

    images = np.empty((total, IMAGE_SIZE, IMAGE_SIZE, 3), dtype=np.uint8)
    n = 0
    for row in ds:
        images[n] = preprocess_celeba(row["image"])
        n += 1
        if n % 20_000 == 0:
            log.info(f"  {n}/{total}")
    images = torch.from_numpy(images[:n]).permute(0, 3, 1, 2).contiguous()
    cache.parent.mkdir(parents=True, exist_ok=True)
    torch.save(images, cache)
    log.info(f"cached {len(images)} faces to {cache}")
    return images


# ---------------------------------------------------------------- diffusion

def build_model():
    return UNet(in_ch=3, n_prints=0, n_marks=0, base_ch=BASE_CH, ch_mult=CH_MULT,
                num_res_blocks=NUM_RES_BLOCKS, attn_levels=ATTN_LEVELS, dropout=DROPOUT)


def denoise(model, x, t):
    no_label = torch.zeros(x.size(0), dtype=torch.long, device=x.device)
    return model(x, t, no_label, no_label)


@torch.no_grad()
def ddim(model, x, ts, alpha_bars):
    """Deterministic DDIM over the decreasing timesteps `ts`, starting from x at ts[0] (v-prediction)."""
    for i, t in enumerate(ts):
        ab = alpha_bars[t]
        ab_prev = alpha_bars[ts[i + 1]] if i + 1 < len(ts) else torch.ones((), device=x.device)
        v = denoise(model, x, t.expand(x.size(0))).float()
        x0 = (ab.sqrt() * x - (1 - ab).sqrt() * v).clamp(-1, 1)
        eps = (x - ab.sqrt() * x0) / (1 - ab).sqrt()
        x = ab_prev.sqrt() * x0 + (1 - ab_prev).sqrt() * eps
    return x


def timesteps_from(t_start, steps, device):
    return torch.linspace(t_start, 0, max(2, steps), device=device).round().long()


def load_ema(device):
    ckpt = torch.load(CKPT_PATH, map_location=device, weights_only=False)
    model = build_model().to(device).eval()
    model.load_state_dict(ckpt["ema"])
    log.info(f"loaded EMA weights from {CKPT_PATH} (epoch {ckpt['epoch']})")
    return model, cosine_alpha_bars(TIMESTEPS).to(device)


# ---------------------------------------------------------------- train

def train():
    device = get_device()
    out_dir = Path(OUT_DIR)
    fig_dir = out_dir / "figs"
    ckpt_dir = out_dir / "checkpoints"
    fig_dir.mkdir(parents=True, exist_ok=True)
    ckpt_dir.mkdir(parents=True, exist_ok=True)
    setup_logging(out_dir / "train.log")
    log.info(f"face diffusion: base_ch={BASE_CH} ch_mult={CH_MULT} res_blocks={NUM_RES_BLOCKS} attn={ATTN_LEVELS} "
             f"epochs={EPOCHS} batch_size={BATCH_SIZE} lr={LR} ema_decay={EMA_DECAY} flip={FLIP}")

    images = load_faces()
    if DATA_ON_GPU:
        images = images.to(device)
    steps_per_epoch = len(images) // BATCH_SIZE

    model = build_model().to(device)
    ema = copy.deepcopy(model).eval().requires_grad_(False)
    log.info(f"model params: {sum(p.numel() for p in model.parameters()) / 1e6:.1f}M on {device}, "
             f"{steps_per_epoch} steps/epoch")

    optimizer = torch.optim.AdamW(model.parameters(), lr=LR, weight_decay=0.0)
    alpha_bars = cosine_alpha_bars(TIMESTEPS).to(device)

    step, start_epoch, losses = 0, 0, []
    if RESUME:
        ckpt = torch.load(RESUME, map_location=device, weights_only=False)
        model.load_state_dict(ckpt["model"])
        ema.load_state_dict(ckpt["ema"])
        optimizer.load_state_dict(ckpt["optimizer"])
        step, start_epoch, losses = ckpt["step"], ckpt["epoch"], ckpt["losses"]
        log.info(f"resumed from {RESUME} at epoch {start_epoch} (step {step})")

    # Same noise every time, so grids from different epochs show the same faces developing.
    fixed_noise = torch.randn(64, 3, IMAGE_SIZE, IMAGE_SIZE, generator=torch.Generator().manual_seed(SEED)).to(device)

    def save_checkpoint(epoch):
        state = {"ema": ema.state_dict(), "epoch": epoch, "step": step}
        torch.save(state, ckpt_dir / f"ema_epoch_{epoch:04d}.pt")
        torch.save({**state, "model": model.state_dict(), "optimizer": optimizer.state_dict(),
                    "losses": losses}, out_dir / "ckpt.pt")
        log.info(f"saved checkpoint at epoch {epoch}")

    def save_figs(epoch):
        x = ddim(ema, fixed_noise, timesteps_from(TIMESTEPS - 1, 50, device), alpha_bars)
        save_image((x + 1) / 2, fig_dir / f"samples_epoch_{epoch:04d}.png", nrow=8, padding=2)
        save_loss_curve(losses, fig_dir / "loss.png")
        log.info(f"saved figs at epoch {epoch}")

    train_model = torch.compile(model) if COMPILE else model
    use_amp = device == "cuda"
    csv_path = out_dir / "loss_log.csv"
    if not csv_path.exists():
        csv_path.write_text("epoch,step,loss,lr,seconds\n")

    for epoch in range(start_epoch + 1, EPOCHS + 1):
        t0 = time.time()
        epoch_loss = torch.zeros((), device=device)
        perm = torch.randperm(len(images), device=images.device)

        for i in range(steps_per_epoch):
            idx = perm[i * BATCH_SIZE:(i + 1) * BATCH_SIZE]
            x0 = images[idx].to(device, non_blocking=True).float() / 127.5 - 1
            if FLIP:
                flip = torch.rand(BATCH_SIZE, 1, 1, 1, device=device) < 0.5
                x0 = torch.where(flip, x0.flip(3), x0)

            t = torch.randint(0, TIMESTEPS, (BATCH_SIZE,), device=device)
            ab = alpha_bars[t].view(-1, 1, 1, 1)
            noise = torch.randn_like(x0)
            x_t = ab.sqrt() * x0 + (1 - ab).sqrt() * noise
            v_target = ab.sqrt() * noise - (1 - ab).sqrt() * x0

            lr = LR * min(1.0, (step + 1) / WARMUP)
            for group in optimizer.param_groups:
                group["lr"] = lr

            with torch.autocast(device_type="cuda", dtype=torch.bfloat16, enabled=use_amp):
                pred = denoise(train_model, x_t, t)
            loss = F.mse_loss(pred.float(), v_target)

            optimizer.zero_grad(set_to_none=True)
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            optimizer.step()

            decay = min(EMA_DECAY, (1 + step) / (10 + step))
            with torch.no_grad():
                for e, mp in zip(ema.parameters(), model.parameters()):
                    e.lerp_(mp, 1 - decay)
                for e, mb in zip(ema.buffers(), model.buffers()):
                    e.copy_(mb)

            step += 1
            epoch_loss += loss.detach()

        epoch_loss = epoch_loss.item() / steps_per_epoch
        losses.append(epoch_loss)
        seconds = time.time() - t0
        with open(csv_path, "a") as f:
            f.write(f"{epoch},{step},{epoch_loss},{lr},{seconds:.1f}\n")
        if epoch % LOG_EVERY == 0:
            log.info(f"epoch={epoch}/{EPOCHS} step={step} loss={epoch_loss:.5f} lr={lr:.2e} "
                     f"{steps_per_epoch / seconds:.1f} it/s")

        if epoch % FIG_EVERY == 0 or epoch == EPOCHS:
            save_figs(epoch)
        if epoch % CKPT_EVERY == 0 or epoch == EPOCHS:
            save_checkpoint(epoch)


# ---------------------------------------------------------------- sample

def sample():
    device = get_device()
    out_dir = Path(SAMPLE_OUT_DIR)
    setup_logging(out_dir / "sample.log")
    model, alpha_bars = load_ema(device)
    torch.manual_seed(SEED)
    x = torch.randn(N_SAMPLES, 3, IMAGE_SIZE, IMAGE_SIZE, device=device)
    x = ddim(model, x, timesteps_from(TIMESTEPS - 1, DDIM_STEPS, device), alpha_bars)
    save_image((x + 1) / 2, out_dir / "samples.png", nrow=int(math.sqrt(N_SAMPLES)), padding=2)
    log.info(f"wrote {N_SAMPLES} faces to {out_dir / 'samples.png'}")


# ---------------------------------------------------------------- face alignment

def face_detector(width, height):
    import cv2

    path = Path(YUNET_PATH)
    if not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        log.info(f"downloading YuNet face detector to {path}")
        urllib.request.urlretrieve(YUNET_URL, path)
    return cv2.FaceDetectorYN.create(str(path), "", (width, height), score_threshold=0.6)


def detect_landmarks(rgb):
    """5 landmarks (eyes, nose tip, mouth corners) of the largest face in an RGB uint8 image, or None."""
    import cv2

    h, w = rgb.shape[:2]
    detector = face_detector(w, h)
    _, faces = detector.detect(cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR))
    if faces is None or len(faces) == 0:
        return None
    face = max(faces, key=lambda f: f[2] * f[3])
    return face[4:14].reshape(5, 2).astype(np.float32)


def landmark_template():
    """Average landmark positions on the 64x64 training crops, measured with the same detector used on your photos."""
    path = Path(TEMPLATE_PATH)
    if path.exists():
        return np.array(json.loads(path.read_text()), dtype=np.float32)

    images = torch.load(DATA_CACHE)
    idx = torch.randperm(len(images), generator=torch.Generator().manual_seed(0))[:2000]
    # The detector misses faces that fill the whole frame, so upscale each crop and give it a border.
    scale, border = 4, 2 * IMAGE_SIZE
    points = []
    for img in images[idx]:
        big = np.asarray(Image.fromarray(img.permute(1, 2, 0).numpy()).resize(
            (IMAGE_SIZE * scale, IMAGE_SIZE * scale), Image.BICUBIC))
        big = np.pad(big, ((border, border), (border, border), (0, 0)), mode="edge")
        lm = detect_landmarks(big)
        if lm is not None:
            points.append((lm - border) / scale)
    if len(points) < 100:
        raise RuntimeError(f"face detector found only {len(points)} faces in 2000 training crops")
    template = np.mean(points, axis=0)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(template.tolist()))
    log.info(f"computed landmark template from {len(points)} training faces: {template.round(1).tolist()}")
    return template


def align_face(path, template):
    """Similarity-warp a photo so its face lands where faces sit in the training crops."""
    import cv2

    rgb = np.asarray(Image.open(path).convert("RGB"))
    # Detect on a downscaled copy of large photos, then map the landmarks back.
    scale = min(1.0, 1024 / max(rgb.shape[:2]))
    small = cv2.resize(rgb, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA) if scale < 1 else rgb
    lm = detect_landmarks(small)
    if lm is None:
        return None
    matrix, _ = cv2.estimateAffinePartial2D(lm / scale, template, method=cv2.LMEDS)
    # Warping straight to 64x64 aliases badly from a large photo, so warp at 4x and downsample.
    up = 4
    big = cv2.warpAffine(rgb, matrix * up, (IMAGE_SIZE * up, IMAGE_SIZE * up),
                         flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    return cv2.resize(big, (IMAGE_SIZE, IMAGE_SIZE), interpolation=cv2.INTER_AREA)


# ---------------------------------------------------------------- variations

def variation_rows(aligned, rows):
    """One row per strength: your photo, a white separator, then the variations touching edge to edge."""
    sep = np.full((IMAGE_SIZE, SEPARATOR_PX, 3), 255, dtype=np.uint8)
    return np.concatenate([np.concatenate([aligned, sep, *row], axis=1) for row in rows], axis=0)


def save_mosaic(mosaic, row_labels, title, path):
    """Draw a pre-tiled image with labels outside it, so there is no whitespace between tiles."""
    h, w = mosaic.shape[:2]
    dpi = 100
    fig, ax = plt.subplots(figsize=(w * FIG_SCALE / dpi, h * FIG_SCALE / dpi))
    ax.imshow(mosaic, interpolation="nearest")
    ax.set_yticks([y for y, _ in row_labels], [label for _, label in row_labels], fontsize=8)
    ax.set_xticks([IMAGE_SIZE / 2, IMAGE_SIZE + SEPARATOR_PX + N_VARIATIONS * IMAGE_SIZE / 2],
                  ["photo", f"{N_VARIATIONS} variations"], fontsize=8)
    ax.tick_params(length=0)
    for spine in ax.spines.values():
        spine.set_visible(False)
    ax.set_title(title, fontsize=10)
    fig.savefig(path, dpi=dpi, bbox_inches="tight", pad_inches=0.05)
    plt.close(fig)


def variations():
    device = get_device()
    out_dir = Path(VARIATIONS_OUT_DIR)
    setup_logging(out_dir / "variations.log")
    model, alpha_bars = load_ema(device)
    template = landmark_template()

    photos = sorted(p for p in Path(MY_PHOTOS_DIR).iterdir() if p.suffix.lower() in IMG_EXTS)
    if not photos:
        raise FileNotFoundError(f"no photos in {MY_PHOTOS_DIR}")
    log.info(f"{len(photos)} photos, strengths={STRENGTHS}, {N_VARIATIONS} variations each")

    strength_labels = [f"s={s:.2f}" for s in STRENGTHS]
    blocks = []  # (photo name, rows mosaic) for the mega plot
    tiles = []  # every aligned photo and variation, for the shuffled mega plot
    for photo in photos:
        aligned = align_face(photo, template)
        if aligned is None:
            log.warning(f"no face found in {photo.name}, skipping")
            continue
        photo_dir = out_dir / photo.stem
        photo_dir.mkdir(parents=True, exist_ok=True)
        Image.fromarray(aligned).save(photo_dir / "aligned.png")

        x0 = torch.from_numpy(aligned).permute(2, 0, 1).float().to(device) / 127.5 - 1
        x0 = x0.expand(N_VARIATIONS, -1, -1, -1)
        g = torch.Generator(device="cpu").manual_seed(SEED)
        rows = []
        for strength in STRENGTHS:
            t_start = int(strength * (TIMESTEPS - 1))
            ab = alpha_bars[t_start]
            noise = torch.randn(x0.shape, generator=g).to(device)
            x_t = ab.sqrt() * x0 + (1 - ab).sqrt() * noise
            x = ddim(model, x_t, timesteps_from(t_start, round(DDIM_STEPS * strength), device), alpha_bars)
            x = ((x + 1) * 127.5).round().clamp(0, 255).to(torch.uint8).permute(0, 2, 3, 1).cpu().numpy()
            for i, img in enumerate(x):
                Image.fromarray(img).save(photo_dir / f"strength_{strength:.2f}_{i:02d}.png")
            rows.append(x)

        tiles += [aligned, *np.concatenate(rows)]
        mosaic = variation_rows(aligned, rows)
        row_labels = [(IMAGE_SIZE * (r + 0.5), label) for r, label in enumerate(strength_labels)]
        save_mosaic(mosaic, row_labels, f"SDEdit variations: {photo.name}", out_dir / f"{photo.stem}_variations.png")
        blocks.append((photo.stem, mosaic))
        log.info(f"{photo.name}: wrote {out_dir / f'{photo.stem}_variations.png'}")

    if not blocks:
        return
    # Mega plot: every photo's block of strength rows stacked, with a thin white gap between photos.
    gap = np.full((SEPARATOR_PX, blocks[0][1].shape[1], 3), 255, dtype=np.uint8)
    parts, row_labels, y = [], [], 0
    for i, (name, mosaic) in enumerate(blocks):
        if i:
            parts.append(gap)
            y += SEPARATOR_PX
        parts.append(mosaic)
        row_labels += [(y + IMAGE_SIZE * (r + 0.5), f"{name}  {label}") for r, label in enumerate(strength_labels)]
        y += mosaic.shape[0]
    save_mosaic(np.concatenate(parts, axis=0), row_labels,
                f"SDEdit variations: all {len(blocks)} photos", out_dir / "all_variations.png")
    log.info(f"wrote mega plot of {len(blocks)} photos to {out_dir / 'all_variations.png'}")
    save_shuffled_mosaic(tiles, out_dir / "all_variations_shuffled.png")


def save_shuffled_mosaic(tiles, path):
    """All tiles in random order (randomly mirrored), edge to edge, no labels; empty cells are filled with repeats."""
    rng = np.random.default_rng(SHUFFLED_SEED)
    n = len(tiles)
    cols = SHUFFLED_COLS or math.ceil(math.sqrt(n))
    n_rows = math.ceil(n / cols)
    order = np.concatenate([rng.permutation(n), rng.integers(0, n, n_rows * cols - n)])
    picked = [tiles[i] for i in order]
    if SHUFFLED_FLIP:
        picked = [t[:, ::-1] if rng.random() < 0.5 else t for t in picked]
    grid = np.concatenate([np.concatenate(picked[r * cols:(r + 1) * cols], axis=1) for r in range(n_rows)], axis=0)
    resample = Image.NEAREST if SHUFFLED_RESAMPLE == "nearest" else Image.LANCZOS
    img = Image.fromarray(grid)
    img = img.resize((img.width * SHUFFLED_UPSCALE, img.height * SHUFFLED_UPSCALE), resample)
    img.save(path)
    log.info(f"wrote shuffled mosaic of {n} faces ({n_rows}x{cols} grid, {img.width}x{img.height}px) to {path}")


if __name__ == "__main__":
    if MODE == "train":
        train()
    elif MODE == "sample":
        sample()
    elif MODE == "variations":
        variations()
    else:
        raise ValueError(f"MODE must be 'train', 'sample' or 'variations', got {MODE!r}")
