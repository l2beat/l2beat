- [x] Move hidden internal interop routes to suffix form (`/interop/{page}/internal`) and keep legacy `/interop/internal/*` redirects.
- [x] Add staging-only public navigation button to jump to internal interop dashboard.
- [x] Unify interop tRPC/server input model to one selection interface (`from: string[]`, `to: string[]`) and remove `selectedChainsIds` usage.
- [x] Refactor interop selection context to a single selection state shape and one API input builder.
- [x] Replace split initial-selection helpers with one shared `initialSelection` parser for SSR/client URL sync.
- [x] Keep shared pages/components, update links/builders for suffix internal paths, and preserve hidden internal/noindex behavior.
- [x] Run verification (`lint`, `typecheck`, `build`).

## Review
- `pnpm --filter @l2beat/frontend lint` (pass)
- `pnpm --filter @l2beat/frontend typecheck` (pass)
- `pnpm --filter @l2beat/frontend build` (pass)
- Public interop now uses `from`/`to` URL params and still keeps pair UX (initial pair picker + pair chain selector).
- Internal interop now uses `/interop/{page}/internal` paths and the same shared selection/API interface.
