# Deployment

## Platform

- Netlify Edge adapter
- Build command uses Qwik build + edge fix script

## Commands

- `bun run build`
- `bun run deploy` (Netlify)
- `bun run deploy:prod`

## Key Files

- `netlify.toml`
- `adapters/netlify-edge/*`
- `scripts/fix-netlify-edge.mjs`
