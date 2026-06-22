-- Backfill: mark every existing aggregate snapshot as `promoted` so no snapshot is
-- status-blind once later logic depends on the status table.
--
-- Runs AFTER the indexer already marks new snapshots (PR B), so this only needs to fill
-- gaps for snapshots created before the writer was deployed. `ON CONFLICT DO NOTHING`
-- guarantees it never overrides a verdict the indexer (or an operator) already wrote.
--
-- `promotedBy = 'auto'` (not a dedicated 'backfill' marker): a backfilled row is a system
-- default, identical in meaning to an engine verdict, so the engine's sticky `upsertAuto`
-- (which only overwrites `promotedBy = 'auto'`) can later correct it. Only human flips
-- (`promotedBy = <email>`) stay sticky.
--
-- `SELECT DISTINCT timestamp` collapses the large aggregate table to one row per snapshot
-- (~hundreds of rows), so this is a small insert despite the source table size.
INSERT INTO "InteropAggregateStatus" ("timestamp", "status", "promotedBy", "checkedAt", "updatedAt")
SELECT DISTINCT "timestamp", 'promoted', 'auto', now(), now()
FROM "AggregatedInteropTransfer"
ON CONFLICT ("timestamp") DO NOTHING;
