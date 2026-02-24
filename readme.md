# Blog

## What is it

My personal blog migrated from Next.js to a lightweight, modern architecture using **Vanilla JS Web Components** and **Static Site Generation (SSG)** powered by **Vite**.

## Architecture

- **Vanilla Web Components**: Custom elements for the header, footer, and post items.
- **SSG Build Pipeline**: A custom TypeScript script (`scripts/build.ts`) that:
  - Parses Markdown content using `marked`.
  - Highlights code blocks at build-time using `shiki` (high-contrast theme for accessibility).
  - Generates RSS (RSS2) and Atom feeds using `feed`.
  - Injects JSON-LD metadata for SEO.
  - Statically pre-renders component shells to ensure visibility without JavaScript.
- **Vite**: Used for bundling assets and providing a fast development server.
- **Biome**: Modern replacement for Rome, used for lightning-fast linting and formatting.

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

## Testing

Run unit tests (Vitest):

```sh
pnpm test
```

Run verification and accessibility tests (Playwright):

```sh
npx playwright test
```

## Deployment

The site is fully static and can be deployed to any static hosting provider (Vercel, GitHub Pages, Netlify, etc.) by serving the contents of the `dist/` directory.
