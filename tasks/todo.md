# Changelog feature implementation plan

## Checklist
- [x] Add changelog content collection schema and register it in collections.
- [x] Add changelog helper to read/sort entries and select active What's New widget entry.
- [x] Update `getAppLayoutProps` to feed What's New from changelog config.
- [x] Add `/changelog` page (data loader, page component, router) and register it in SSR + client router maps.
- [x] Add `Changelog` side link in `SideNavLayout`.
- [x] Add sample changelog entry content in `src/content/changelog`.
- [x] Add tests for changelog widget-selection logic.
- [x] Run frontend tests/typecheck/lint for touched scope and confirm green.

## Review
- Implemented a content-driven changelog with markdown entries under
  `packages/frontend/src/content/changelog`.
- Added deterministic What's New selection:
  active entries are `publishedAt <= now < expiresAt`, and overlapping entries
  resolve to the newest `publishedAt`.
- Added `Changelog` page and routing at `/changelog`, and linked it in side nav.
- Verification:
  - `pnpm --filter @l2beat/frontend test -- src/server/features/changelog/getChangelogEntries.test.ts`
  - `pnpm --filter @l2beat/frontend typecheck`
  - `pnpm --filter @l2beat/frontend lint`
