Here's the full backlog we accumulated across the three PRs — everything intentionally deferred, grouped by area, with where it lives and a sketch of the fix. Items 1–5 would fit naturally into one "token relation hardening" follow-up PR.

**Ingestion correctness (the two P2-class races/warts)**

- **Make `lockedToken` resolution conditional on the DB value** — [TokenRelationIngestion.ts](packages/token-backend/src/ingestion/TokenRelationIngestion.ts) reads `existing` *outside* the transaction and then issues an unconditional `updateByPrimaryKey`, so a human correction committed in that sub-second window gets silently overwritten by the observation-derived value — violating the documented "an identified role is never overwritten" under concurrency. Fix: a repository update variant guarded by `WHERE "lockedToken" IS NULL` that returns the affected-row count, and — the subtle part — **skip the `TokenDbHistory` entry when 0 rows were touched**, otherwise the audit trail records an update that never happened. (This was PR comment 1; consequence today is bounded to one lost-but-redoable human edit, hence deferrable.)
- **In-batch candidate merge is first-wins** — in `ingestBatch`, `!candidates.has(key)` means the first transfer for a route wins the whole candidate slot. If a *later transfer in the same batch* identifies the locked side but the first didn't, the relation is inserted with `lockedToken = NULL` and has to wait for a future transfer on that route to resolve. Fix: when a subsequent same-key candidate carries a non-null `lockedToken` and the stored candidate doesn't, adopt the role (decide whether to also swap the evidence sample to the identifying transfer — arguably yes, so evidence and role agree). Cosmetic latency, self-corrects on active routes.

**Planner validation (friendly errors instead of raw CHECK violations)** — both in [planning.ts](packages/token-backend/src/planning.ts)

- **Reject self-pairs in `planAddTokenRelation`** — a human adding a relation from a token to itself currently passes all planning checks (`normalizeTokenRelation` treats equal endpoints as "ordered") and dies at execute time on the `TokenRelation_endpoints_ordered` CHECK as an ugly raw DB error. Throw a `PlanningError` when the normalized endpoints are identical. Ingestion already filters this case; only the human path is unguarded.
- **Validate `lockedToken` × `bridgeType` consistency** — neither the add nor the update intent enforces that `lockedToken` may only be set when `bridgeType = 'lockAndMint'`. Setting a locked token on a `burnAndMint` relation now hits the `TokenRelation_lockedToken_only_for_lock_and_mint` CHECK as a raw error. Add the check to both `planAddTokenRelation` and `planUpdateTokenRelation`; optionally add a sentence to the spec's "Human edits" section once done.

**Read-path bug**

- **Case-sensitive role computation in `getRelations`** — in the deployedTokens router ([index.ts](packages/token-backend/src/trpc/routers/deployedTokens/index.ts)), the repository query lowercases the input address, but `tokenRelationRole` and `otherEndpoint` compare the *raw* URL-provided address against stored-lowercase values. A checksummed address in the page URL loads fine but shows the wrong role and returns the queried token itself as "other endpoint". One-line fix: lowercase the input address at the top of the handler (or inside `tokenKey`). Latent today because in-app links use stored lowercase addresses.

**Type hardening (you already planned this one)**

- **Stronger input type for `getBestEffortBridgeTypeFromPartialSupplyAction`** — [partialSupplyActionBridgeType.ts](packages/backend/src/modules/interop/plugins/partialSupplyActionBridgeType.ts) accepts both flags as potentially defined, while every caller guarantees at least one is `undefined`; encode that in the parameter type so the both-defined case (where `??` would silently prefer `srcWasBurned`) becomes unrepresentable. You mentioned this fix is already coming in a separate PR — listing it for completeness.

**Latent trap worth a comment or guard (low priority)**

- **ASCII-only parity between `isOrdered` and the CHECK constraint** — `normalizeTokenRelation`'s JS comparison (UTF-16 code units) and the DB's `COLLATE "C"` (UTF-8 byte order) agree only for ASCII. All stored chains/addresses are lowercase ASCII today, so it's purely latent — but if a non-ASCII address ever entered the pipeline, code and constraint could disagree and inserts would fail confusingly. Cheapest mitigation: a comment on `isOrdered` (partially there) plus an assertion or normalization guaranteeing ASCII at the ingestion boundary.

**Dev tooling (bit us during the merge, will bite again)**

- **Turbo cache can be poisoned by stale `tsc` incremental state** — the `build` task caches `build/**`/`dist/**`, but `*.tsbuildinfo` sits outside the cached outputs. After branch switching, `tsc` can no-op ("up to date") over stale artifacts, and turbo then caches those stale outputs under the *current* source hash — after which every turbo run (root `pnpm typecheck`, `build:dependencies`) restores the poison over any manual rebuild. Options: include `*.tsbuildinfo` in each package's turbo `outputs`, use `tsc --build --force` in build scripts, or have build scripts clean first. Worth a small infra PR so the "phantom missing symbol" failure mode disappears for everyone.

One explicit non-item, so it doesn't resurface as doubt later: the history page reading both `tokenFrom*`/`tokenTo*` and `tokenA*`/`tokenB*` spellings (`LEGACY_ENDPOINT_FIELDS`) is permanent by design — `TokenDbHistory` snapshots are immutable — not tech debt to clean up.
