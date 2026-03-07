# API / Data Docs

This project uses static JSON files as the data API.

## Base Path

All files are publicly available under:

- `/data/config.json`
- `/data/content.json`
- `/data/events.json`
- `/data/sponsors.json`
- `/data/team.json`

## `/data/config.json`

Site-level metadata and home page blocks.

Key fields:

- `meta.eventName`
- `meta.tagline`
- `meta.dates`
- `meta.venue`
- `stats.events`
- `stats.participants`
- `stats.colleges`
- `days[]`: `{ day, date, events[], highlight, bgImage }`

## `/data/content.json`

UI copy and SEO labels for routes.

Key sections:

- `header`
- `layout`
- `home`
- `eventsPage`
- `contactPage`
- `seo`

## `/data/events.json`

Event explorer source.

Key sections:

- `clusters[]`: `{ id, name, color, description }`
- `events[]`: `{ id, name, category, cluster, day, timing, location, fee, status, description, image, registrationUrl }`

## `/data/sponsors.json`

Sponsor tiers:

- `sponsors.platinum[]`
- `sponsors.gold[]`
- `sponsors.silver[]`
- `sponsors.media[]`

## `/data/team.json`

Contact page team directory.

Key sections:

- `order[]`
- `president[]`
- `vicePresidents[]`
- `coordinators[]`
- `sponsorship[]`
- `publicRelation[]`
- `webtek`
