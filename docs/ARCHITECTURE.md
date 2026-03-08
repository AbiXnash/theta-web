# Architecture

## Runtime

- Framework: Qwik + Qwik City routing
- Rendering: SSR + resumability via Qwik
- Styling: Tailwind CSS + shared utility classes in `src/global.css`
- Deployment target: Netlify Edge

## Application Structure

- `src/routes/layout.tsx`: global app shell, header/footer, and shared wrappers.
- `src/components/header/header.tsx`: primary navigation (desktop and mobile states).
- `src/routes/index.tsx`: home page sections (hero, day cards, stats, sponsors).
- `src/routes/events/index.tsx`: event search/filter grid and modal details.
- `src/routes/contact/index.tsx`: organizing team and WebTek cards.

## Data Flow

Pages fetch static JSON from `/public/data` using `fetch()` inside Qwik `useVisibleTask$` blocks.

- No hardcoded event/sponsor/team content in route markup.
- Page copy and labels come from `content.json` (home/events/contact/header/layout).
- Day cards are configured under `config.json -> days[]`.
- Team images use a local fallback avatar at `/public/team/default-avatar.svg` when profile images are missing.

## Styling Model

- Design tokens are defined as CSS variables in `src/global.css`.
- Shared primitives:
  - `.theta-shell` (glass/surface container)
  - `.theta-panel` (card panel)
  - `.theta-badge` (pill tag)
  - `.theta-focus` (focus-visible accessibility ring)

## Accessibility & UX Notes

- Modal overlays support keyboard close with `Escape`.
- Focus-visible states are preserved via `.theta-focus`.
- Mobile navigation uses tap-friendly block links.
