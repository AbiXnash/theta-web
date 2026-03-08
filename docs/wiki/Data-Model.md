# Data Model

## `public/data/content.json`

UI copy configuration.

### Major sections

- `header`
- `layout`
- `home`
- `eventsPage`
- `contactPage`
- `seo`

### Notable keys

- `home.sponsors.hall*` (previous-sponsor messaging)
- `eventsPage.metrics`
- `eventsPage.filterLabels`
- `eventsPage.comingSoon` (maintenance mode for `/events`)
- `contactPage.webtek*` labels

## `public/data/config.json`

Site meta + home block configuration.

- `meta` (eventName, tagline, dates, venue)
- `stats`
- `about`
- `days[]` with day card fields and background image

## `public/data/events.json`

- `clusters[]`: id, name, color, description
- `events[]`: id, name, category, cluster, day, timing, location, fee, status, description, image, registrationUrl

## `public/data/sponsors.json`

Tiered sponsor list source used by Home sponsor lanes.

## `public/data/team.json`

Contact team directory.

- `order[]` controls section ordering
- section lists map to card grids
- `webtek` controls support links
