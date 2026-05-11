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
