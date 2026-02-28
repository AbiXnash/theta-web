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

## Route Map

- `/` (`src/routes/index.tsx`)
  - Landing page with hero, countdown, day-wise highlights, sponsor sections, and CTA.
  - Loads `config.json`, `sponsors.json`, and `events.json` on client for dynamic sections.
- `/events` (`src/routes/events/index.tsx`)
  - Event explorer with search, category/status/cluster filters, and event detail modal.
  - Loads `events.json` for events and cluster metadata.
- `/contact` (`src/routes/contact/index.tsx`)
  - Team/contact directory with member cards and direct mail/phone links.
  - Loads `team.json`.
- Shared layout (`src/routes/layout.tsx`)
  - Global wrapper for all routes: header, footer, optional custom cursor, and under-dev badge.

## Codebase File Guide

### Root

- `package.json` - scripts and dependencies.
- `bun.lock` - Bun lockfile (primary package manager lock).
- `package-lock.json` - npm lockfile (kept for compatibility).
- `vite.config.ts` - base Vite + QwikCity config used by all builds.
- `netlify.toml` - Netlify build settings (`bun run build`, publish dir, Bun version).
- `eslint.config.js` - lint configuration.
- `prettier.config.js` - formatting configuration.
- `tsconfig.json` - TypeScript compiler config.
- `qwik.env.d.ts` - Qwik/Vite env typing.
- `README.md` - project documentation.
- `adapters/netlify-edge/vite.config.ts` - Netlify Edge SSR adapter build config.

### `src/`

- `src/root.tsx` - app root (`QwikCityProvider`, `RouterOutlet`, document shell).
- `src/global.css` - global styles, animations, utility classes, and accessibility motion fallback.
- `src/entry.dev.tsx` - dev/client entry.
- `src/entry.ssr.tsx` - SSR render entry.
- `src/entry.preview.tsx` - local preview server entry.
- `src/entry.netlify-edge.tsx` - Netlify Edge entry for production deployment.

### `src/components/`

- `src/components/header/header.tsx` - top navigation (desktop + mobile menu).
- `src/components/router-head/router-head.tsx` - dynamic `<head>` tags (meta, canonical, manifest, preconnect).
- `src/components/digit-input.tsx` - reusable digit input component.
- `src/components/theme/theme-context.tsx` - theme context provider/hooks.
- `src/components/theme/theme-toggle.tsx` - theme toggle UI.

### `src/routes/`

- `src/routes/layout.tsx` - shared route layout wrapper.
- `src/routes/index.tsx` - homepage route.
- `src/routes/events/index.tsx` - events listing/filter/detail route.
- `src/routes/contact/index.tsx` - contact/team route.

### `public/`

- `public/theta-logo.png` - main brand/logo asset.
- `public/favicon.svg` - browser favicon.
- `public/icon.svg` - app icon used by PWA manifest.
- `public/manifest.json` - web app manifest metadata.
- `public/robots.txt` - crawler rules.
- `public/_headers` - Netlify cache headers for static assets.
- `public/config.json` - homepage/site-level content config.
- `public/events.json` - events + clusters content dataset.
- `public/sponsors.json` - sponsor tiers dataset.
- `public/team.json` - contact/team dataset.

### Generated/Local-Only Directories

- `dist/` - build output (generated).
- `.netlify/` - Netlify local/runtime artifacts (generated).
- `node_modules/` - installed dependencies.
- `tmp/` - temporary local files.
