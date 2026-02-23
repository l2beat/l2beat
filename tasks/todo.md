- [x] Remove duplicated internal interop UI and backend stacks (`pages/interop/internal/**`, `server/features/scaling/interop/internal/**`, `trpc/routers/interopInternal.ts`).
- [x] Unify API to `interop.*` with dual selection inputs (`selectedChainsIds` for public pair, `from`/`to` for internal directional mode).
- [x] Implement shared directional selection resolver and directional post-filtering in existing interop services.
- [x] Refactor shared interop context to support both modes with URL sync (`selectedChains` vs `from`/`to`) and mode-aware API/url builders.
- [x] Reuse the same 4 interop pages for public/internal modes with mode-aware selector rendering and query input wiring.
- [x] Keep hidden `/interop/internal/*` routes and route them to shared loaders/pages with internal defaults (`all/all`) and `noindex`.
- [x] Reuse existing widgets/cards/tables and top-item modals; remove internal duplicated component variants.
- [x] Run verification (`lint`, `typecheck`, `build`) and confirm public pair behavior remains intact.

## Review
- `pnpm --filter @l2beat/frontend lint` (pass)
- `pnpm --filter @l2beat/frontend typecheck` (pass)
- `pnpm --filter @l2beat/frontend build` (pass)
- Public pair-mode flow remains on `/interop/*` with `selectedChains=a,b` query semantics.
- Internal hidden routes `/interop/internal/*` now reuse shared pages/components and use directional `from`/`to` semantics.
