# Design System

## Typography

- Font: Space Grotesk
- Strong headline hierarchy (`font-extrabold`, `font-black`)

## Core Primitives (`src/global.css`)

- `.theta-shell`: primary glass-like container
- `.theta-panel`: bordered card with offset comic shadow
- `.theta-badge`: pill labels
- `.theta-focus`: focus-visible ring and accessibility outline
- `.theta-sticker`: sticker chip style

## Theme Tokens

Managed in `:root` CSS variables in one place:

- `--theta-primary`
- `--theta-primary-soft`
- `--theta-bg`, `--theta-surface`, `--theta-card`, `--theta-stroke`

## Motion Primitives

- `.theta-reveal` (+ delay variants)
- `.theta-skeleton` shimmer placeholder
- `.theta-icon-bob`
- Reduced-motion override via `@media (prefers-reduced-motion: reduce)`

## Design Direction

- Gumroad-inspired blocks/cards
- Comic-card offsets and borders
- Tech-festival atmosphere via accents, chips, and animated panels
