# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Aayushi Verma's personal academic website (awesomecosmos.github.io), built on the classic **al-folio** Jekyll theme. This is a monolithic fork: `_layouts/`, `_includes/`, `_sass/`, `_plugins/`, `_scripts/` are all committed directly in this repo, not pulled in from a theme gem. Edit theme/layout files here directly.

## Commands

```bash
bundle install                 # install Ruby gems
bundle exec jekyll serve       # dev server -> http://localhost:4000
bundle exec jekyll build       # production-style build to _site/
npx prettier . --check         # formatting check (CI-enforced via .github/workflows/prettier.yml)
npx prettier . --write         # auto-fix formatting
bin/cibuild                    # what CI runs to build (bundle exec jekyll build)
bin/deploy                     # manual gh-pages build + force-push (CI normally deploys instead)
```

Docker alternative (avoids local Ruby setup):
```bash
docker compose up              # pulls prebuilt image, serves on :8080, live-reload on :35729
docker compose up --build      # build the image locally instead of pulling
docker compose -f docker-compose-slim.yml up   # <100MB slim image variant
```

There is no test suite in this repo (no `test/` directory, no test script in `package.json`). `requirements.txt` (`nbconvert`) is a Python dependency needed at build time by `jekyll-jupyter-notebook` to render `.ipynb` files embedded in posts.

Deploy is automatic: `.github/workflows/deploy.yml` builds and publishes on push to `main`/`master` (path-filtered — only triggers when content/asset/config files change), then runs `purgecss` against `_site/assets/css/*.css` to strip unused CSS before publishing.

## Architecture

**`_config.yml` is the single source of truth** for feature flags, the Jekyll `plugins:` list, and the `third_party_libraries:` block (every vendored JS/CSS library's CDN URL, version, and SRI hash — used by `_includes/head.liquid`/`scripts.liquid` to emit `<link>`/`<script>` tags). Toggling a feature (math, comments, analytics, search, image zoom, etc.) is almost always a `_config.yml` edit, not a code change.

**`_data/socials.yml`** holds the actual social/profile usernames (GitHub, LinkedIn, ORCID, Google Scholar, X, etc.) — exposed to Liquid as `site.data.socials.*`. Two templates consume this: `_includes/social.liquid` (renders the icon links) and `_includes/metadata.liquid` (builds the schema.org `sameAs` array for SEO). Both must read from `site.data.socials.*`, not `site.<field>` directly — the latter was a real bug fixed in this repo's history (commit `ead58e8`) and is easy to reintroduce if this file is touched without checking `social.liquid`'s pattern first.

**Custom Ruby plugins in `_plugins/`** — each registers a Liquid tag, filter, or generator with no equivalent elsewhere in the repo:
- `details.rb` — `{% details %}` collapsible block tag
- `file-exists.rb` — `{% file_exists "path" %}` tag
- `remove-accents.rb` — `remove_accents` filter (diacritic stripping for slugs)
- `hide-custom-bibtex.rb` — `hideCustomBibtex` filter, strips internal keywords from rendered BibTeX (paired with `filtered_bibtex_keywords` in `_config.yml`)
- `cache-bust.rb` — `bust_file_cache`/`bust_css_cache` filters, append a content-hash query string to asset URLs
- `download-3rd-party.rb` — `site:after_init` hook; when `third_party_libraries.download: true`, downloads all CDN assets locally and rewrites `_config.yml` URLs to local paths
- `external-posts.rb` — `Jekyll::Generator` that synthesizes post documents from `external_sources:` (RSS feeds or manual URL lists) in `_config.yml`
- `google-scholar-citations.rb` / `inspirehep-citations.rb` — `{% google_scholar_citations %}` / `{% inspirehep_citations %}` tags, scrape live citation counts with in-memory caching (used by `enable_publication_badges` on the publications page)

**Content collections**: `_posts` (blog, mostly astronomy/space and CS topics), `_projects`, `_news`, `_books`, `_pages` (about/cv/blog/publications/talks/news, `_pages/about.md` is the site homepage via `permalink: /`), `_bibliography/papers.bib` (BibTeX, rendered via `jekyll-scholar`, config under the `scholar:` key in `_config.yml`).

**SEO**: `serve_og_meta` and `serve_schema_org` in `_config.yml` gate Open Graph tags and the schema.org JSON-LD block in `_includes/metadata.liquid`; both are currently enabled. `google_site_verification` must be the token from Search Console's **HTML tag** verification method, not the DNS TXT method — this site is a bare `*.github.io` subdomain with no custom domain, so DNS-based verification isn't possible (no DNS zone to add a record to).
