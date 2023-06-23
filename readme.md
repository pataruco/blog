# Blog

## What is it

Is my website written in TypeScript, using [Next.js](https://nextjs.org/), and deployed into [Vercel](https://vercel.com/)

## Development

Clone this repo.

```sh
git clone git@github.com:pataruco/blog.git
```

Install dependencies

```sh
pnpm install
```

Run local server

```sh
pnpm dev
```

In your browser, navigate to http://localhost:3000/

## Lint and formating

I am using [Rome tools](https://rome.tools/).

Lint

```sh
pnpm lint
```

Format

```sh
pnpm format
```

## Test

Run tests

```sh
pnpm test
```

## Deployment

For a preview environment, create a pull request, and a GitHub Workflow will trigger the deployment.

For a production environment, create a Git tag with the following pattern `R.*` and push it to the main branch

```sh
git tag R.<SEMVER NUMBER>
git push --tags
```
