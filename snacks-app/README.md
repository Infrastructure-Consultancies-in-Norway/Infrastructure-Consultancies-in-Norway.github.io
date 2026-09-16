# SNACks - React TypeScript Application

A modern React TypeScript application for SNACks (Infrastructure Consultancies in Norway).

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Test

```bash
npm test
```

## Deploy

The app automatically deploys to GitHub Pages via GitHub Actions on push to
`master`. Configure the public `FEEDBACK_API_URL` and `TURNSTILE_SITE_KEY`
repository Actions variables before enabling the feedback widget in production.
Server-side setup is documented in [`../feedback-api/README.md`](../feedback-api/README.md).
