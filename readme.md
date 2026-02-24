# Blog

## What is it

My personal blog using Vanilla JS Web Components built with Static Site Generation (SSG) powered by Vite.

## Architecture

- Vanilla Web Components: Custom elements for the header, footer, and post items.
- SSG Build Pipeline: A custom TypeScript script (`scripts/build.ts`) that:
  - Parses Markdown content using `marked`.
  - Highlights code blocks at build-time using `shiki`
  - Generates RSS (RSS2) and Atom feeds using `feed`.
  - Injects JSON-LD metadata for SEO.
  - Statically pre-renders component shells to ensure visibility without JavaScript.


## Development

Clone this repo.

```sh
git clone git@github.com:pataruco/blog.git
```

Install dependencies

```sh
pnpm install
```

Run local development server

```sh
pnpm dev
```

In your browser, navigate to http://localhost:5173/

## Build and Preview

Generate the static site:

```sh
pnpm build
```

Preview the generated build:

```sh
pnpm preview
```

## Lint and Formatting

I am using [Biome](https://biomejs.dev/).

```sh
pnpm lint
pnpm format
```

## Deployment

The site is fully static and can be deployed to any static hosting provider (Vercel, GitHub Pages, Netlify, etc.) by serving the contents of the `dist/` directory.
