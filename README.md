# Theta Web

Official website for **Theta 2026**, built with **Qwik + Qwik City + Tailwind**.

## Stack

- Qwik / Qwik City
- Vite
- Tailwind CSS
- Bun (package manager and script runner)
- Netlify Edge Functions (deployment target)

## Prerequisites

- Bun `>= 1.3`
- Node.js `>= 18.17` (Qwik tooling compatibility)

## Local Development

```bash
bun install
bun run dev
```

App runs on `http://localhost:9090` by default.

## Scripts

- `bun run dev` - start local dev server
- `bun run build` - full production build (client + server + typecheck + lint)
- `bun run build.client` - build client assets only
- `bun run build.server` - build Netlify Edge SSR bundle
- `bun run build.types` - TypeScript check
- `bun run lint` - ESLint
- `bun run preview` - local preview (vite preview)
- `bun run serve` - local Netlify runtime (`netlify dev`)
- `bun run deploy` - deploy preview to Netlify (`netlify deploy --build`)
- `bun run deploy:prod` - deploy production to Netlify (`netlify deploy --build --prod`)

## Netlify Deployment (Bun)

This repo is preconfigured for Netlify:

- `netlify.toml` uses:
  - `command = "bun run build"`
  - `publish = "dist"`
  - `BUN_VERSION = "1.3.8"`
- Qwik Netlify Edge adapter files are included:
  - `adapters/netlify-edge/vite.config.ts`
  - `src/entry.netlify-edge.tsx`

### Option A: Deploy from Git (recommended)

1. Push this repo to GitHub.
2. In Netlify, create a site from the repository.
3. Build settings (if prompted):
   - Build command: `bun run build`
   - Publish directory: `dist`
4. Deploy.

### Option B: Deploy from CLI

```bash
bunx netlify login
bunx netlify link
bun run deploy:prod
```

## Icons and Manifest

- Favicon: `public/favicon.svg`
- App icon: `public/icon.svg`
- Web app manifest: `public/manifest.json`

## Data Files

Editable content lives in:

- `public/config.json`
- `public/events.json`
- `public/sponsors.json`
- `public/team.json`
