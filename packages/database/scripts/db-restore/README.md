# DB restore scripts

Restore data from a remote database into your local DB, either by feature (`db-restore.sh`) or by individual tables (`table-restore.sh`).

> ⚠️ **These scripts wipe the affected local tables before restoring.** Be careful.

## Prerequisites

1. Install the PostgreSQL client tools (`psql`, `pg_dump`, `pg_restore`) via the `postgres` or `libpq` package, and make sure they are on your `PATH`.
2. Run the scripts from the package root (`packages/database`) — Prisma needs it.
3. Add variables to a `.env` file in `packages/database`:

   ```
   DEV_LOCAL_DB_URL=postgresql://postgres:password@localhost:5432/l2beat_local
   DEV_REMOTE_DB_URL_READ_ONLY=
   ```

   > ⚠️ **Use read-only credentials for the remote URL.**

## Restore by feature

```bash
./scripts/db-restore/db-restore.sh <FEATURE> [SINCE]
```

Run without arguments to list the available features. Currently:
`da`, `liveness`, `tvs`, `activity`, `shared`, `interop`, `interop-aggregates`, `token-db`, `tracked-txs`, `privacy`.

`SINCE` is an optional cutoff (any Postgres-parseable timestamp, e.g. `2026-07-01`). Tables with a `timestamp` column only get rows where `timestamp >= SINCE`; tables without one (e.g. `IndexerState`, `IndexerConfiguration`) are still copied in full.

```bash
./scripts/db-restore/db-restore.sh interop 2026-07-01
```

> Note: with `SINCE`, indexer state still reflects the full remote sync range, while older rows are missing locally — fine for working on the frontend/API, but backfills won't re-fetch the missing range.

## Restore by table

Restore one or more specific tables:

```bash
./scripts/db-restore/table-restore.sh IndexerState
./scripts/db-restore/table-restore.sh IndexerState IndexerConfiguration
```

## What the scripts do

1. Truncate the target tables locally.
2. Apply pending Prisma migrations (`prisma migrate deploy`).
3. Dump the tables' data from the remote DB.
4. Restore the dump into the local DB and clean up the dump file.
