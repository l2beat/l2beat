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
