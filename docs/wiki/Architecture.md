# Architecture

## Runtime

- Qwik + Qwik City routing
- SSR + resumability
- Tailwind CSS utilities + `src/global.css` design primitives

## App Shell

- `src/routes/layout.tsx`
- Shared header/footer
- Global watermark
- Floating utility actions (under-dev info, scroll-to-top)

## Route Components

- `src/routes/index.tsx` -> home landing sections
- `src/routes/events/index.tsx` -> explorer + filters + modal + coming-soon mode
- `src/routes/contact/index.tsx` -> team directory + support blocks

## Component Layer

- `src/components/header/header.tsx` -> desktop nav + mobile sidebar/dropdown
- `src/components/router-head/router-head.tsx` -> meta, canonical, favicon, manifest

## Data Flow

All route copy and data are fetched from JSON via `useVisibleTask$`:

- `public/data/config.json`
- `public/data/content.json`
- `public/data/events.json`
- `public/data/sponsors.json`
- `public/data/team.json`

No event/sponsor/team content is hardcoded in cards.
