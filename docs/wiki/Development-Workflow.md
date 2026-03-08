# Development Workflow

## Local Run

```bash
bun install
bun run dev
```

## Validation

```bash
npm run build.types
npm run lint
```

## Release Versioning

- Semantic version in `package.json`
- Minor releases for feature batches
- Patch releases for fixes/security updates

## Content-first Updates

Preferred flow:

1. Update `public/data/content.json` labels first
2. Add fallback defaults in route interfaces
3. Wire UI to copy keys
4. Validate via lint + typecheck
