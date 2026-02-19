---
title: "Changelog is live on L2BEAT"
summary: "We launched an on-page changelog and connected it to the What's New widget in navigation."
publishedAt: "2026-02-19T12:00:00.000Z"
whatsNew:
  image: "/images/announcements/changelog-latest-widget.svg"
  alt: "Read the latest L2BEAT changelog updates"
  expiresAt: "2026-04-01T00:00:00.000Z"
---

This entry announces the launch of the changelog feature and its integration with the navigation widget.

### New

- Added a dedicated **Changelog** page to track product updates.
- Added a **Changelog** link to the side navigation.

### Improved

- The existing **What's New** widget can now be driven from changelog entries.
- Editors can schedule widget visibility with an explicit expiration date.

### How to publish updates

1. Create a new markdown file in `src/content/changelog`.
2. Fill in frontmatter (`title`, `publishedAt`, optional `summary`).
3. Add a `whatsNew` block when the update should be promoted in navigation.
