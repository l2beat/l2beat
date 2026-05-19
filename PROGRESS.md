# Automatic Token Ingestion Progress

## 2026-05-11 - Slice 1: queue persistence

Implemented the persistent queue primitive for automatic token ingestion.

- Added `TokenIngestionQueueEntry` to the Prisma schema.
- Added migration `20260511120000_add_token_ingestion_queue`.
- Added `TokenIngestionQueueRepository`.
- Exposed the repository from `createTokenDatabase`.
- Exported queue record/address/state types from `@l2beat/database`.

The queue currently stores one row per `(chain, address)` with these states:

- `pending`
- `conflict`
- `error`

Repository behavior:

- `enqueue` inserts a pending row and is a no-op when the address is already queued.
- `findNextPending` returns the oldest pending row.
- `getByStates` lists rows for UI/API use.
- `markConflict` and `markError` keep failed rows visible for human action.
- `retry` moves `conflict` and `error` rows back to `pending`.
- `remove` deletes a processed row.

Notes:

- Address casing is normalized to lowercase in the repository.
- No cron loop, ingestion processor, TRPC API, or token-ui page changes are included yet.
- I used `conflict` and `error` as explicit stored states because the requested UX includes both.

## 2026-05-12 - Slice 2: queue feeder loop

Implemented the scheduled pre-step that feeds the automatic ingestion queue from newly inserted interop transfers.

- Added `InteropTransfer.serialId`, a database-generated insertion-order serial.
- Added migration `20260512120000_add_token_ingestion_settings_and_transfer_serial`.
- Added generic `TokenDbSetting` storage and `TokenDbSettingRepository` in TokenDB.
- Exposed the settings repository from `createTokenDatabase`.
- Added `InteropTransferRepository.getTokenAddressesAfterSerialId`.
- Added `TokenIngestionQueueFeederLoop` in `packages/token-backend`.
- Wired the loop into `packages/token-backend/src/server.ts`.

Behavior:

- The loop is enabled with `TOKEN_INGESTION_ENABLED`.
- The schedule defaults to `TOKEN_INGESTION_INTERVAL_MS=60000`.
- Each run reads `interop-transfers:lastSerialId` from TokenDB settings, loads transfer rows with a greater `serialId`, enqueues unique source/destination token addresses, then stores the newest `serialId`.
- The cursor advances only after enqueueing finishes. If cursor persistence fails, the next run replays the same transfer rows and queue `enqueue` remains idempotent.
- Late-arriving transfers with old event timestamps are still picked up because the stored setting follows insertion order, not transfer timestamp.

Notes:

- This slice only feeds the queue. It does not implement the processor drain or token upsert logic yet.
- The loop is disabled by default until the processor side exists.

Follow-up adjustment:

- Renamed the transfer serial from `ingestionId` to `serialId` so the generic interop transfer row does not expose the token ingestion use case.
- Replaced the dedicated `TokenIngestionCursor` table with generic `TokenDbSetting` storage. The feeder currently uses one setting: `interop-transfers:lastSerialId`.
- Renamed `TokenDbSettingsRepository` / `tokenDbSettings` to singular `TokenDbSettingRepository` / `tokenDbSetting` to match the project's singular model repository naming.

## 2026-05-12 - Slice 3: queue drain

Implemented the automatic ingestion queue drain inside the scheduled token ingestion loop.

- Renamed `TokenIngestionQueueFeederLoop` to `TokenIngestionLoop`.
- Kept the existing pre-step that enqueues new interop transfer token addresses.
- Added `InteropTransferIndex`, which loads the current interop transfer table once per tick and indexes transfers in memory by normalized `(chain, address)`.
- Added `TokenIngestionProcessor` for one queue entry at a time.
- Extracted deployed-token fact fetching from `checkDeployedToken` into `fetchDeployedTokenFacts` so manual form checks and automatic ingestion use the same RPC/explorer logic.

Behavior:

- Each tick first enqueues tokens from new interop transfers, then drains pending queue entries.
- Interop token addresses are normalized to TokenDB addresses before queueing and processing: bytes32 EVM addresses are cropped to 20-byte addresses and lowercased; zero addresses are ignored.
- Abstract token resolution first uses non-swapping transfers (`lockAndMint` and `burnAndMint`) and live TokenDB data for the other side.
- If non-swapping transfer evidence points to more than one abstract token, or disagrees with an existing deployed token abstract, the queue entry is marked `conflict`.
- If transfer evidence cannot resolve an abstract token, ingestion falls back to CoinGecko platform lookup.
- If CoinGecko finds a coin with no existing `AbstractToken`, ingestion prepares a new `AbstractToken` with `reviewed: false` and writes it in the same transaction as the deployed token.
- Deployed-token RPC/explorer facts are fetched only after an abstract token has been resolved.
- Missing required deployed-token facts (`symbol`, `decimals`, or `deploymentTimestamp`) mark the queue entry as `error`; they are not silently dropped.
- Queue entries are removed only when no abstract token can be resolved or after successful processing.
- After a deployed token is inserted or updated, related interop transfers are marked unprocessed and neighboring transfer tokens are re-enqueued. No-op existing tokens do not propagate neighbors, avoiding ping-pong queue loops.

Follow-up planning note:

- Updated `docs/automatic-token-ingestion.md` with a proposed debug-only `staged` queue state. In debug approval mode, the pre-step can enqueue discovered addresses as `staged`; the drain ignores them until a researcher approves one entry, moving it to `pending`.

## 2026-05-13 - Slice 4: queue UI and staged approval

Implemented the Token UI page for inspecting and approving automatic ingestion queue entries.

- Added `staged` as a first-class `TokenIngestionQueueEntry` state.
- Added `TokenIngestionQueueRepository.approve`, which moves only staged entries to `pending`.
- Added `TOKEN_INGESTION_REQUIRE_APPROVAL`; when enabled, newly discovered transfer tokens and neighbor tokens are enqueued as `staged` instead of `pending`.
- Added a `tokenIngestionQueue` tRPC router with `getAll` and `approve`.
- Added `/tokens/ingestion-queue` in token-ui and a sidebar link under Tokens.
- The page shows status, chain, address, message, created/updated timestamps, explorer links when chain metadata is available, and an approve button for staged entries.
- Updated `docs/automatic-token-ingestion.md` to name `TOKEN_INGESTION_REQUIRE_APPROVAL=true` as the rollout/debug toggle.

## 2026-05-13 - Slice 5: dry-run preview and trace

Split `TokenIngestionProcessor.process()` into a read-only `plan()` phase and
a write-only `apply()` phase. The plan produces an `IngestionTrace` — an
ordered list of decision steps plus a single outcome — and the apply reads
that trace and performs the corresponding TokenDB and queue mutations.
`process()` is now `plan()` then `apply()`. The preview/dry-run feature falls
out of this split: it is just `plan()` without `apply()`.

- Added `IngestionTrace`, `IngestionStep`, `IngestionOutcome`, and
  `DeployedTokenWrite` types in `packages/token-backend/src/ingestion/IngestionTrace.ts`.
- Refactored `TokenIngestionProcessor` to push every decision into the trace
  and move every write into `apply()`. Neighbor propagation is now declared
  in the outcome (`neighborsToEnqueue`) so `apply()` is self-contained.
- Hoisted processor construction to `server.ts` so the preview tRPC route
  works even when the loop is disabled. `TokenIngestionLoop` now takes a
  `TokenIngestionProcessor` instance instead of constructing one itself.
- Added the processor to the tRPC context.
- Added `tokenIngestionQueue.preview` tRPC mutation: builds the interop
  transfer index from the current snapshot, synthesizes a queue entry, calls
  `processor.plan()`, and returns the trace. No mutations.
- Exported the trace types from `@l2beat/token-backend`.
- Added `IngestionPreviewDialog` in `packages/token-ui/src/components/`.
  Renders the step timeline and outcome block, reusing the existing `Diff`
  component for update outcomes.
- Added a "Preview" button on every row of `TokenIngestionQueuePage`,
  regardless of state. The dialog is read-only and the existing approve
  button is unchanged.
- Updated affected router test files (`abstractTokens`, `chains`,
  `deployedTokens`, `search`, `tokenIngestionQueue`) to pass
  `tokenIngestionProcessor: {} as never` when constructing test contexts.

Behavior preserved:

- All five outcomes (`skip`, `conflict`, `error`, `noop`, `write`) map to
  the same queue and TokenDB side-effects as before.
- `interopTransfer.markAsUnprocessedByTokens` still runs for both `write`
  and `noop` outcomes, matching the previous behavior.
- Neighbors are deduplicated in the trace; `apply()` calls `enqueue` once
  per unique neighbor instead of once per transfer.

Documentation:

- Wrote `docs/mdbook/specs/l2b_specs/automatic_token_ingestion.md`. This is
  intended as the consolidated reference for the automatic ingestion
  algorithm and supersedes the working notes in
  `docs/automatic-token-ingestion.md` and earlier `PROGRESS.md` slices.
- Added it to `docs/mdbook/specs/SUMMARY.md`.
- Linked it from `packages/token-backend/README.md`.

## 2026-05-15 - Slice 6: queue-wide predicted outcomes (plan / fetch / apply)

Split the processor's single read phase into two: a fast, fully local
`plan()` that makes **no external calls**, and a separate `fetch()` that
is the only place RPC/explorer/per-coin CoinGecko calls happen. This lets
the queue UI show what would happen for every row at no external cost.

- `IngestionTrace.ts`: collapsed the previous `pending-insert` proposal
  into a single `pending` outcome that carries `operation` (`insert` /
  `update`), an optional `existing` deployed-token record (for update),
  and an `abstract` of `{ kind: 'existing', id }` or
  `{ kind: 'new-coingecko', coingeckoId, symbol }`. Slimmed the
  `resolved-from-coingecko-new-abstract` step to just
  `{ coingeckoId, symbol }` and added a new `fetched-coingecko-abstract`
  step emitted by `fetch()` once the abstract record is materialized.
- `TokenIngestionProcessor`:
  - `plan()` no longer calls `fetchDeployedTokenFacts` and no longer
    calls `buildAbstractToken` (the per-coin CoinGecko endpoints
    `getCoinDataById` / `getCoinMarketChartRange`). For new addresses
    and for first-time CoinGecko coins it returns a `pending` outcome.
  - New `fetch(trace)` is the only place external calls happen. For
    `pending` outcomes it materializes a new CoinGecko abstract when
    needed, then — for inserts — calls `fetchDeployedTokenFacts`, and
    upgrades the outcome to `write` (insert/update) or downgrades it to
    `error` when required facts are missing.
  - `apply()` switch was extended with a `pending` case that throws,
    so any future path forgetting `fetch()` fails loudly.
  - `process()` is now `plan → fetch → apply`.
- `tokenIngestionQueue.getPage`: runs `plan()` per row inline and
  returns `predictedOutcomes` alongside the existing `entries` /
  `totalCount`. Reuses a single transfer index built from
  `interopTransfer.getAll()` for the request.
- `tokenIngestionQueue.preview`: now runs `plan` + `fetch` so the dialog
  keeps showing fetched-facts and the full deployed-token record.
- `TokenIngestionQueuePage`: removed `Updated` and `Created` columns;
  added a `Will do` column that renders the predicted outcome with a
  badge plus a short hint (e.g. abstract id, or pending CoinGecko coin).
- `IngestionPreviewDialog`: added rendering for the new
  `fetched-coingecko-abstract` step and the `pending` outcome (used only
  if the dialog is ever opened on a plan-only trace).
- Tests: added cases asserting that `plan()` does not call
  `fetchDeployedTokenFacts`, `getCoinDataById`, or
  `getCoinMarketChartRange`; that `fetch()` is the layer that calls
  them; and that `apply()` throws on `pending`. Updated the
  `getPage` router test to mock the transfer index and processor and
  assert `predictedOutcomes` is returned.

Rationale: a previous iteration ran a `plan()` that still made per-coin
CoinGecko calls inside `resolveAbstractFromCoingecko`. Once `getPage`
started calling `plan()` for every visible row, this caused a 429
stampede on cold start because each unique CoinGecko coin needed two
per-coin endpoint calls. After this slice, the queue UI populates the
"Will do" column without paying any per-coin CoinGecko cost; per-coin
calls happen only during drain or when a researcher clicks "Preview" on
a single row.

Documentation:

- Updated `docs/mdbook/specs/l2b_specs/automatic_token_ingestion.md` to
  describe `plan + fetch + apply`, the new `pending` outcome, the
  zero-external-calls guarantee for `plan`, and the queue-wide
  predicted-outcome consumption by `getPage`.

## 2026-05-17 - Slice 7: shared write boundary

Unified the two TokenDB write paths (user-driven `intent → plan →
execute` and automatic ingestion's `plan → fetch → apply`) behind a
single primitive, so that future cross-cutting concerns — most
importantly the persistent token-history table — land in one place and
cover both paths automatically.

- Added `packages/token-backend/src/commitTokenChanges.ts` exposing
  `commitTokenChanges(tokenDb, commands)` plus the
  `AbstractTokenAssignmentProof` type. The helper is a pure router that
  switches on `Command` kind and performs the matching repository call;
  it is transaction-agnostic, so each caller keeps its own concurrency
  story.
- `AbstractTokenAssignmentProof` is one of `{ kind: 'manual'; user }`,
  `{ kind: 'coingecko' }`, or `{ kind: 'non-swapping-transfer'; transfer }`.
  Each pipeline attaches the proof to its commands at *plan time*, so
  the proof is visible in the diff the user sees before clicking Confirm
  and in the ingestion preview dialog. The non-swapping-transfer variant
  carries the *full* transfer because the interop transfer table is a
  24h sliding window.
- Reworked `planning.ts` to stamp `abstractTokenAssignmentProof` on
  `AddDeployedTokenCommand` and `UpdateDeployedTokenCommand` whenever
  the operation introduces or changes `abstractTokenId`:
  `{ kind: 'manual'; user: <email> }` for the live user, `null` when the
  assignment is cleared, untouched otherwise. `generatePlan` now takes
  a required `{ user: string }` option.
- Refactored `execution.ts` to call `commitTokenChanges(db, commands)`
  with no extra arguments. `executePlan` still opens a SERIALIZABLE
  transaction, regenerates the plan, and deep-compares it.
  `planAndExecute` now takes `{ user }` instead of a `WriteSource`.
- Refactored `TokenIngestionProcessor` so the proof rides on the
  deployed-token write itself:
  - `buildPlanOutcome` stamps proof directly on
    `outcome.deployedToken.update` for the resolved/known-existing case.
  - `pending` outcomes keep the proof on the pending variant as a
    transient field; `fetch()` transfers it onto the resulting
    deployed-token write (update's `update.abstractTokenAssignmentProof`
    or insert's `record.abstractTokenAssignmentProof`).
  - `apply()` simply calls `commitTokenChanges(db, commands)` — no
    `WriteSource`.
- Removed `WriteSource` entirely; the write boundary no longer needs to
  know who is writing because proofs are decided upstream.
- Threaded `proof` through abstract-token resolution:
  - `resolveAbstractFromNonSwappingTransfers` returns the first
    supporting transfer (whose other side actually carries the chosen
    abstract) and records it as the proof on `resolved` results.
  - `resolveAbstractFromCoingecko` returns a `coingecko` proof both when
    reusing an existing abstract and when materializing a new one.
  - The "fallback to the deployed token's existing abstract" branch is
    a dedicated `existing-noop` resolution variant — no proof is
    constructed because the outcome is always a noop.
- The `abstractTokenAssignmentProof` JSONB column on `DeployedToken`
  (migration `20260518120000_add_abstract_token_assignment_proof`) is
  typed `unknown` at the repository layer so old shapes still read; the
  strong proof type is enforced only at plan time. The repository makes
  the proof JSON-safe before persistence, including serializing BigInt
  raw amounts as decimal strings.
- Updated `scripts/import-generated.ts` to pass `{ user }` to
  `planAndExecute`.
- Updated the trpc plan router to pass `{ user: ctx.session.email }` to
  both `generatePlan` and `executePlan`.

Documentation:

- Updated `docs/mdbook/specs/l2b_specs/token_db/README.md` with an
  explicit section on the distinction between the two "planning"
  subsystems (UX construct vs cost/separation construct) and on the
  shared write boundary that sits below both.
- Updated `docs/mdbook/specs/l2b_specs/token_db/automatic_token_ingestion.md`
  to describe `commitTokenChanges` as a pure router and the plan-time
  proof attachment that powers preview diffs.

Tests:

- Rewrote `commitTokenChanges.test.ts` as pure routing-only coverage:
  all eight command kinds dispatch correctly, and proof fields on the
  command are passed through verbatim.
- Added `planning.test.ts` covering the plan-time proof stamping:
  manual proof on insert with non-null abstract, null proof on insert
  with null abstract, manual proof on update when the assignment
  changes, null proof on update when the assignment is cleared, and
  no proof change on updates that touch other fields or repeat the
  existing abstract id.
- Updated existing trace/fetch tests so the proof is asserted on
  `record.abstractTokenAssignmentProof` /
  `update.abstractTokenAssignmentProof` instead of a separate `proof`
  field on the write outcome. `pending` outcomes keep the transient
  `proof` field, which existing tests already assert.

Notes:

- This slice deliberately does **not** introduce the history table.
  The proof now lands on `DeployedToken.abstractTokenAssignmentProof`,
  but the per-edit audit trail (who/when/which command, including for
  writes that don't touch `abstractTokenId`) is the next follow-up.
- Intent/Plan/Execute is preserved as the UX construct it always was;
  forcing ingestion through it would re-create user-confirmation
  machinery for a flow that has no user. The two pipelines now share
  the write *primitive* without sharing the wrapper.
- Moving proof stamping out of the write boundary was driven by a UX
  bug: with stamping at the boundary, neither the user-side plan
  preview nor the ingestion preview dialog could show the proof field
  in the diff — the proof was decided after Confirm. Plan-time stamping
  makes the change visible everywhere the diff is rendered, including
  cases where a manual edit overwrites a previous ingestion-stamped
  proof.

## 2026-05-19 - Slice 8: token DB history

Added a per-command audit trail recorded at the shared write boundary
so the automatic ingestion feature can ship without losing visibility
into what it has done. After an initial pass that denormalized
before/after records into separate columns, the slice was simplified
to store the executed `Command` verbatim — every command kind already
carries everything the audit needs, so the boundary stays a pure
router with no extra reads or merges.

- New `TokenDbHistoryEntry` table (migration
  `20260519120000_add_token_db_history`) with columns: `id`,
  `timestamp`, `source` (`manual` | `ingestion`), `userEmail`,
  `commandType`, `command` (JSONB). Indexed on `timestamp` and
  `(commandType, timestamp)`.
- New `TokenDbHistoryRepository` with `insert`, `getRecent(limit)`,
  `getAll`, and `deleteAll`. The repository converts `BigInt` values
  inside command JSON to decimal strings before persisting so transfer
  proofs (which carry `srcRawAmount`/`dstRawAmount`) round-trip
  cleanly.
- Added `existing` to `DeleteAbstractTokenCommand` and
  `DeleteDeployedTokenCommand`, mirroring the shape already used by
  `Update*` commands. `planDeleteAbstractToken` and
  `planDeleteDeployedToken` now fetch the existing record at plan
  time (and throw a `PlanningError` if it's missing). This makes
  delete commands self-describing — the history row alone says what
  was deleted, without the boundary doing a hidden read.
- Removed the obsolete `DeleteAllAbstractTokensCommand` and
  `DeleteAllDeployedTokensCommand` variants from token-backend and
  token-ui. They were historical bulk-maintenance commands, are not
  reachable from current intents or ingestion, and should not be
  supported or special-cased in future TokenDB history/UI work.
- Reintroduced `WriteSource` (`{ kind: 'manual'; user } | { kind:
  'ingestion' }`) — but only for audit, not for proof stamping. Proofs
  continue to ride on individual commands. `commitTokenChanges` now
  takes `(tokenDb, commands, source)`; for each command it inserts
  one history row carrying the command JSON, `commandType`, and
  `source` / `userEmail`. No before/after merging.
- `executePlan` and `planAndExecute` pass `{ kind: 'manual', user:
  opts.user }` to `commitTokenChanges`; `TokenIngestionProcessor.apply`
  passes `{ kind: 'ingestion' }`. The `user` arg already existed on
  both write paths from the previous slice, so no caller changed
  shape.
- Tests:
  - `commitTokenChanges.test.ts` asserts that each command kind
    produces a history row whose `command` field is the executed
    `Command` verbatim. Existing routing tests were updated to
    construct `Delete*` commands with `existing` and to pass a
    mocked `tokenDbHistory` and a write source.
  - New `TokenDbHistoryRepository.test.ts` covers manual/ingestion
    sources, BigInt JSON serialization (round-tripped as decimal
    strings), and `getRecent` ordering.
  - `TokenIngestionLoop.test.ts` setups were extended to include a
    `tokenDbHistory` mock so the drain doesn't fault when calling
    the write boundary.

Documentation:

- Added a "Token DB history" section to
  `docs/mdbook/specs/l2b_specs/token_db/automatic_token_ingestion.md`
  explaining why a single `command` column is sufficient. Renamed
  the trailing "Future: persistent audit" section to "Future:
  persistent trace audit" since the per-command audit is now done —
  the only remaining follow-up is persisting the full
  `IngestionTrace` for reasoning, not the diff.

Notes:

- No UI is included. The repository exposes the data; surfacing it
  in Token UI is a separate slice.
- Proof stamping and history recording are intentionally split: the
  proof explains *why* an abstract was chosen and lives on the
  deployed token row; history explains *what* command was executed
  and lives on its own table. They overlap only inside `command`,
  where any proof attached at plan time is naturally part of the
  persisted command snapshot.
- The first iteration of this slice added denormalized
  `previousRecord` and `newRecord` columns; we collapsed those into
  a single `command` JSON column once it was clear every command
  type already carries the equivalent (`existing` + `update` on
  updates and deletes, `record` on adds). The before/after split
  was duplicating data already present in the command and was also
  losing the "patch shape" of updates by merging existing + update
  into a single resulting record.
