# Theta Web v2

Official website for **Theta 2026** built with **Qwik + Qwik City + Tailwind CSS**.

## What's New in v2

- Light-first black/white visual system with violet primary accent.
- Reworked responsive navigation with improved mobile interaction.
- Comic-style day cards with JSON-driven artwork.
- Refined events, sponsors, and contact page UI.
- Events route supports a JSON-driven `comingSoon` mode.
- Global motion polish with reduced-motion accessibility fallback.

## Stack

- Qwik / Qwik City
- Vite
- Tailwind CSS
- DaisyUI (utility components)
- Netlify Edge deployment

## Prerequisites

- Node.js `>= 18.17`
- Bun `>= 1.3` (recommended)

## Local Development

```bash
bun install
bun run dev
```

Default dev URL: `http://localhost:5173` (or the Vite-assigned port).

## Scripts

- `bun run dev` - start local SSR development server
- `bun run build` - production build
- `bun run build.types` - TypeScript check
- `bun run lint` - ESLint
- `bun run preview` - preview production build
- `bun run serve` - Netlify local runtime

## Content System

All editable content is JSON-driven from:

- `/public/data/config.json`
- `/public/data/content.json`
- `/public/data/events.json`
- `/public/data/sponsors.json`
- `/public/data/team.json`

Day-card artwork is loaded from `/public/day/*.svg` and referenced in `config.json`.

### JSON Copy Coverage

- Home sponsors section labels (including previous-sponsor messaging) come from `content.json -> home.sponsors`.
- Events page metric/filter labels come from `content.json -> eventsPage.metrics` and `eventsPage.filterLabels`.
- Events maintenance state comes from `content.json -> eventsPage.comingSoon`.
- Contact support labels and CTA copy come from `content.json -> contactPage`.

## UX Quality-of-Life

- Press `/` on the Events page to focus the search input.
- Scroll-to-top floating action button appears after scrolling.
- Skeleton placeholders are shown in Events when data is not ready.

## Route Map

- `/` - home/landing page
- `/events` - searchable/filterable event explorer
- `/contact` - organizing team and WebTek contact directory

## Docs

- [Architecture](./docs/ARCHITECTURE.md)
- [API/Data Docs](./docs/API.md)
