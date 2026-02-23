- [x] Move hidden internal interop routes to suffix form (`/interop/{page}/internal`) and keep legacy `/interop/internal/*` redirects.
- [x] Add staging-only public navigation button to jump to internal interop dashboard.
- [x] Rename directional selector artifacts to multi-chain selector.
- [x] Remove legacy pair parsing; use only `from`/`to` URL/query semantics for selection.
- [x] Unify interop selection state interface to array-based `{ from: string[]; to: string[] }` across SSR/context/UI APIs.
- [x] Refactor interop server data flow to a single selection path (same functions for pair and multi-chain).
- [x] Update database repository method signatures used by interop filters to accept chain arrays.
- [x] Run verification (`lint`, `typecheck`, `build`).

## Review
- `pnpm --filter @l2beat/frontend lint` (pass)
- `pnpm --filter @l2beat/frontend typecheck` (pass)
- `pnpm --filter @l2beat/frontend build` (pass)
- `pnpm build:dependencies:frontend` was run to refresh workspace dependency types after repository signature updates.
- `pnpm --filter @l2beat/database lint` (pass)
- `pnpm --filter @l2beat/database typecheck` (pass)
- Public mode still enforces pair selection in UI, but uses the same array-based `from`/`to` contract as internal mode.
