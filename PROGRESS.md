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

Verification:

- `pnpm -C packages/database typecheck` passed.
- `pnpm -C packages/database lint` passed.
- Targeted test passed with `7 passing`:
  `pnpm exec mocha --no-config --require esbuild-register --timeout 10000 src/repositories/TokenIngestionQueueRepository.test.ts`
- `pnpm -C packages/database test -- src/repositories/TokenIngestionQueueRepository.test.ts` ran the broader package suite because of the package Mocha config. The new queue tests passed, but the full run failed in an unrelated existing `IndexerStateRepository` test because the test database contained an `indexer` row when that test expected none.

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

Verification:

- `pnpm -C packages/database db:generate-types` passed.
- `pnpm -C packages/database build` passed.
- `pnpm -C packages/database typecheck` passed.
- `pnpm -C packages/database format` passed.
- `pnpm -C packages/database lint` passed.
- `pnpm -C packages/token-backend typecheck` passed after rebuilding `@l2beat/database`.
- `pnpm -C packages/token-backend lint` passed.
- `pnpm -C packages/token-backend test -- src/ingestion/TokenIngestionQueueFeederLoop.test.ts` passed with `84 passing`; the package Mocha config ran the broader token-backend suite.
- `pnpm -C packages/database test -- src/repositories/TokenDbSettingRepository.test.ts src/repositories/InteropTransferRepository.test.ts` did not run because the local test database has a pre-existing failed migration: `20260325094309_add_interop_derived_fulfilled`.

Follow-up adjustment:

- Renamed the transfer serial from `ingestionId` to `serialId` so the generic interop transfer row does not expose the token ingestion use case.
- Replaced the dedicated `TokenIngestionCursor` table with generic `TokenDbSetting` storage. The feeder currently uses one setting: `interop-transfers:lastSerialId`.
- Renamed `TokenDbSettingsRepository` / `tokenDbSettings` to singular `TokenDbSettingRepository` / `tokenDbSetting` to match the project's singular model repository naming.

Verification after the repository rename:

- `pnpm -C packages/database format` passed.
- `pnpm -C packages/database build` passed.
- `pnpm -C packages/database typecheck` passed.
- `pnpm -C packages/database lint` passed.
- `pnpm -C packages/token-backend typecheck` passed.
- `pnpm -C packages/token-backend lint` passed.
- `pnpm -C packages/token-backend test -- src/ingestion/TokenIngestionQueueFeederLoop.test.ts` passed with `84 passing`; the package Mocha config ran the broader token-backend suite.
