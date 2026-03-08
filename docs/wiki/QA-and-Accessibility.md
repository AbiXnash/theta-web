# QA and Accessibility

## Required Checks Before Push

- `npm run build.types`
- `npm run lint`
- Manual route smoke test: `/`, `/events`, `/contact`

## Functional Checks

- Mobile navigation open/close and route tap behavior
- Sponsor modal and day modal close via overlay + `Escape`
- Events filter/search state interactions

## Accessibility Checks

- Keyboard focus states visible
- Color contrast maintained for badges/buttons
- Reduced-motion support verified
