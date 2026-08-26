# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Qiyao Xue's personal academic website (`https://xue-qi-yao.github.io`), built on the
[al-folio](https://github.com/alshedivat/al-folio) Jekyll theme. Most files are upstream
theme code; the personal content lives in a small number of places (see "Where the personal
content lives"). `README.md`, `INSTALL.md`, `CUSTOMIZE.md`, `FAQ.md`, and `CONTRIBUTING.md`
are upstream theme docs, not docs for this site.

Source branch is `main`; the built site is published to the `gh-pages` branch by CI.

## Commands

Local dev is Docker-based (Ruby/Jekyll deps are baked into the image):

```bash
docker compose pull && docker compose up   # or: ./docker_local_depolyment.sh
```

Serves on http://localhost:8080 with livereload. Edits to `_config.yml` trigger a Jekyll
restart via `bin/entry_point.sh` (other files just rebuild).

Native (no Docker) alternative — requires Ruby, Bundler, and `jupyter` on PATH:

```bash
bundle install && bundle exec jekyll serve   # http://localhost:4000
```

Other commands:

```bash
bundle exec jekyll build          # one-shot build into _site/ (same as bin/cibuild)
npx prettier --write .            # format; CI enforces this, config in .prettierrc
purgecss -c purgecss.config.js    # strip unused CSS (build step; run after jekyll build)
```

There is no test suite. "Passing" means the Jekyll build succeeds and prettier is clean.

## Deploy

`.github/workflows/deploy.yml` runs on push to `main`: `bundle exec jekyll build` with
`JEKYLL_ENV=production`, then purgecss, then pushes `_site/` to `gh-pages`. GitHub Pages
serves `gh-pages`. Do not hand-edit `gh-pages` — it is fully regenerated.

`bin/deploy` does the same thing manually from a local checkout; it force-pushes `gh-pages`
and is only for when CI is unavailable.

Note the `paths:` filter in `deploy.yml` — edits to files outside that list (e.g. most
top-level docs) will not trigger a rebuild.

## Where the personal content lives

Changing site content almost always means touching one of these, not the theme internals:

- `_pages/about.md` — the landing page. Front matter controls the profile image, the
  selected-papers list, and the news feed; body prose below the `---`.
- `_bibliography/papers.bib` — the single source for the publications page AND the
  "selected papers" block on the homepage. See "Bibliography conventions" below.
- `_news/YYYY_M_D.md` — one file per announcement, rendered newest-first. `inline: true`
  means the text renders directly in the feed rather than as a linked post.
- `assets/json/resume.json` — the CV. `_pages/cv.md` renders it through `_layouts/cv.liquid`
  and the `_includes/resume/*.liquid` partials (JSON Resume schema). `_data/cv.yml` is the
  legacy/alternative source and is _not_ what drives the current page.
- `_data/socials.yml`, `_data/coauthors.yml`, `_data/repositories.yml` — social links,
  coauthor name→homepage mapping, and the GitHub repos shown on `/repositories/`.
- `assets/img/`, `assets/pdf/` — profile picture, publication previews, CV PDF, posters.

Nav order is set per-page in front matter (`nav: true` + `nav_order`). `_pages/books.md`
and `_pages/about_einstein.md` are inherited demo pages, currently hidden/excluded.

## Bibliography conventions

`papers.bib` entries carry al-folio-specific fields beyond standard BibTeX; these drive
rendering in `_layouts/bib.liquid`:

- `abbr={CVPR}` — venue chip. **The value must have a matching key in `_data/venues.yml`**
  or the chip renders without a color/link. Variants like `CVPR (Oral)` are separate keys.
- `selected=true` — promotes the entry to the homepage selected-papers list.
- `preview={foo.png}` — thumbnail, resolved against `assets/img/publication_preview/`.
- `bibtex_show={true}` — renders the "Bib" expander.
- `pdf`, `poster`, `slides`, `code`, `website`, `arxiv`, `html`, `video`, `supp` — link buttons.
- `google_scholar_id={<scholar_id>:<article_id>}` — live citation count, fetched at build
  time by `_plugins/google-scholar-citations.rb` (network call during build; failures
  degrade to no badge).

The full list of fields stripped from the displayed BibTeX is `filtered_bibtex_keywords`
in `_config.yml` — add any new custom field there too, or it leaks into the shown BibTeX.

## Architecture notes

Standard Jekyll layering, worth knowing before editing theme files:

- `_layouts/*.liquid` — page shells (`about`, `page`, `cv`, `bib`, `distill`, …), selected
  by `layout:` in front matter. `_includes/*.liquid` — reusable partials.
- `_sass/` — styles, entry point `assets/css/main.scss`; `_variables.scss` and
  `_themes.scss` hold the theme/dark-mode tokens. `sass: style: compressed` in production.
- `_plugins/*.rb` — custom Ruby build hooks (Google Scholar / InspireHEP citation counts,
  cache-busting, third-party asset download, external post fetching). Several make network
  requests at build time.
- `_scripts/*.js` — JS templated through Liquid at build time (search index, analytics
  setup, photoswipe); included via `include: ["_pages", "_scripts"]` in `_config.yml`.
- Collections `books`, `news`, `projects` are declared in `_config.yml`, but only `_news/`
  exists in this fork — there is no `_posts/`, `_projects/`, or `_books/` directory, so the
  blog and projects sections are effectively off.

`_config.yml` is the main control surface: the large `enable_*` block near the bottom
toggles features (math, dark mode, masonry, medium-zoom, progress bar, analytics), and the
`scholar:` block configures jekyll-scholar (grouping by year, APA style, author name
matching on `Xue, Qiyao` for bolding).

## Formatting

Prettier with `@shopify/prettier-plugin-liquid`, `printWidth: 150`. `.prettierignore`
excludes vendored assets (`_sass/font-awesome/`, `_sass/tabler-icons/`, `assets/js/search/`,
`_scripts/`, minified files). A pre-commit config exists (`.pre-commit-config.yaml`:
trailing whitespace, EOF, YAML check, large files) — install with `pre-commit install` if
you want it enforced locally.
