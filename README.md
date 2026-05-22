# Personality Calculator

Personality Calculator is a multilingual personality test web app built with React and Vite. It provides a large catalog of lightweight tests, localized quiz pages, themed test experiences, and shareable result cards.

The production site is designed for static-first delivery on Cloudflare, with generated HTML entry pages for individual tests, sitemap generation, and SPA fallback behavior for client-side routes.

## Features

- React 18 single-page app powered by Vite.
- Hundreds of generated personality test pages.
- Multilingual UI and test content support.
- Dedicated quiz experiences for generic tests, MBTI, and Tomodachi-style tests.
- Per-test visual themes, progress tracking, and result summaries.
- Shareable result card generation through `html-to-image`.
- SEO-oriented generated HTML pages, sitemap, and `llms.txt`.
- Cloudflare deployment support through Wrangler.

## Tech Stack

- React
- Vite
- Cloudflare Workers / Pages tooling
- Wrangler
- Lucide React icons
- Playwright for site verification helpers

## Getting Started

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Vite runs with `--host 0.0.0.0`, so the app can be opened from the local machine or other devices on the same network.

## Available Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run generate:catalog
```

Generates the lightweight test catalog and per-test loader modules under `src/data/generated-tests/`. These generated files should not be edited manually.

```bash
npm run build
```

Regenerates the catalog and builds the production app into `dist/`.

```bash
npm run verify
```

Regenerates the catalog and runs project-specific verification checks, including generated test coverage, route entrypoints, static HTML pages, sitemap output, bundle boundaries, and key quiz/result-card behavior.

```bash
npm run preview
```

Builds the app and starts a local Wrangler preview.

```bash
npm run deploy
```

Builds the app and deploys it with Wrangler.

## Project Structure

```text
src/
  data/
    generated-tests/        Generated per-test modules
    generatedTestCatalog.js Generated lightweight test catalog
    generatedTestLoaders.js Generated dynamic loader map
    testTranslations.js     Localized test metadata and content
    tests.jsx               Core test definitions
  pages/
    home/                   Home page
    mbti/                   MBTI experience
    quiz/                   Generic test experience and test data
    tomodachi/              Tomodachi test experience
  i18n.js                   UI translation helpers
  main.jsx                  App route selection
  styles.css                Global styling and page themes
scripts/
  generate-catalog.mjs      Catalog/code generation script
  verify-site.mjs           Build verification script
vite.config.js              Vite and static page generation config
wrangler.jsonc              Cloudflare deployment config
```

## Test Catalog Generation

The app uses a generated catalog so the homepage and route selection can stay lightweight while individual tests are loaded only when needed.

Running `npm run generate:catalog` creates:

- `src/data/generatedTestCatalog.js`
- `src/data/generatedTestLoaders.js`
- `src/data/generated-tests/*.js`

Because these files are generated, update the source test data instead of editing generated modules directly.

## Static Pages and SEO

During production builds, the custom Vite plugin creates static HTML files for generated test routes in `dist/`. It also writes:

- `dist/sitemap.xml`
- `dist/llms.txt`

Canonical URLs are generated for `https://personalitycalculator.org`.

## Internationalization

UI strings are handled through `src/i18n.js`. Test-specific localized content is handled through `src/data/testTranslations.js`.

When adding or improving a localized test, include translations for:

- Test title
- Intro text
- Category label
- Questions
- Result dimensions
- Result summaries and advice, when applicable

## Deployment

The project is configured for Cloudflare through `wrangler.jsonc`.

Build and deploy:

```bash
npm run deploy
```

The Cloudflare asset configuration uses SPA fallback behavior, while the build also emits static HTML files for supported test pages.

## Development Notes

- Keep generated files out of manual edits.
- Run `npm run build` before deployment.
- Run `npm run verify` when changing test data, routing, generated pages, result-card behavior, or sitemap output.
- Preserve localized content coverage when adding new tests or changing quiz copy.
