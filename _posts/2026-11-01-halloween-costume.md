---
layout: post
title: My Halloween Costume!
date: 2026-11-01 00:00:00
description: This Halloween, inspiration struck me and I decided to make my own AI-inspired costume (which doubles as a meta-commentary on AI). 
thumbnail: assets/img/2026-11-01-halloween-costume/my_halloween_costume.jpeg
tags: random
categories: philosophy computer-science
featured: false
---

This Halloween, inspiration struck me and I decided to make my own AI-inspired costume (which doubles as a meta-commentary on AI). 

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2026-11-01-halloween-costume/my_halloween_costume.jpeg" class="img-fluid rounded z-depth-1 d-block mx-auto" max-width="300px" %}
    </div>
</div>
<div class="caption">
    My uncanny valley costume. Top row is the pure noise the images were generated from, faces get more and more distorted as you reach the bottom of the costume. Source: author.
</div>

The concept is "AI's uncanny valley". The twist is I trained my own [diffusion model](#brief-interlude-on-the-diffusion-model) and inferred on my face and tech CEO faces to get the AI-generated face images, and the lower on my costume you get, the more distorted and uncanny the faces get, to the point where they don't resemble the original faces at all. I added to the horror by doing my own uncanny valley makeup, hence the creepy stare (what!? it's called *method acting*).

I usually don't dress up for Halloween, but I've been ruminating on the state of AI lately and thought this would be a fun blend of art, science, and horror (as is appropriate, of course, for Halloween)! The thing is, AI has really advanced as a technology in the last 3-4 years. I'm sure we all remember the [spaghetti Will Smith memes](https://arstechnica.com/information-technology/2023/03/yes-virginia-there-is-ai-joy-in-seeing-fake-will-smith-ravenously-eat-spaghetti/) from a few years ago, when AI still couldn't quite get faces right: 

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2026-11-01-halloween-costume/will_smith_meme.jpg" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Will Smith spaghetti meme from 2023. Source: arstechnica.
</div>

Fast-forward to today, it's becoming increasingly difficult to distinguish between AI-generated images and real images (e.g. [this](https://www.cbsnews.com/news/ai-quiz-spotting-fake-images-verification-tool-veriff/) and [this](https://www.microsoft.com/en-us/microsoft-365/microsoft-designer/how-to-tell-if-images-are-ai-generated)). This is concerning to me as someone who does research on computer vision security. A research topic in the literature that I find interesting is that of identifying the provenance of AI-generated images, and from an attack/defense perspective, watermarking AI-generated images, and finding ways to forge/avoid the watermark for detection. Basically, we're playing a cat-and-mouse security game to be able to detect AI-generated images, and to avoid detection of AI-generated images. This, to me, is the real horror: when AI is so good at generating images that you can't even tell if it's real or not. 

I have some more thoughts on AI, especially with how it's affecting me personally in academia, but that's a topic for another blogpost! 

## Brief Interlude on the Diffusion Model 

I've been getting interested in diffusion models lately as part of my research, and used this Halloween costume idea as a small side project to learn more about how these diffusion models work. Full disclaimer, I did use Claude to help code up the whole thing, [here's the code](https://github.com/awesomecosmos/awesomecosmos.github.io/tree/main/assets/jupyter/face_diffusion.py). 

The basic idea for how these models learn is by iteratively adding noise to the image, and then denoising to try and recover the image. A few hundred rounds of this helps condition the model to learn what images in the training dataset (in my case, the [CelebA face dataset](https://huggingface.co/datasets/nielsr/CelebA-faces)) look like. 

The magic happens at inference time, when the trained diffusion model samples from pure noise to create a brand new synthetic image. My version is slightly different as it just creates diffusion-generated variations on the faces I provided (my face and tech CEO faces), but the idea is the same. Here's an example of what the model generated based on my face (first column is my real face, everything else is diffusion-generated):

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2026-11-01-halloween-costume/aayushi5_variations.png" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
</div>
<div class="caption">
    Diffusion-generated variations on my face. Source: author + Claude.
</div>

Pretty cool! This isn't even a finetuned model or anything, which is why the generated images are not very smooth and obviously out of place. This model took me about 21 hours to train on an [NVIDIA RTX Pro 6000 Blackwell](https://www.nvidia.com/en-us/products/workstations/professional-desktop-gpus/rtx-pro-6000/) for 150 epochs. I assume longer training might have helped improve the quality but this was a budget side project, some sacrifices in quality are ok. 

So there we have it! It was an eventful October for me, getting into the spooky spirit with my diffusion models. I wonder what horrific idea I might have for next year? 🤔

🎃👻☠️🍬🕯️

**No generative AI was used to write this blog article, this is content straight from my brain to your screen, 100% aayushi!**