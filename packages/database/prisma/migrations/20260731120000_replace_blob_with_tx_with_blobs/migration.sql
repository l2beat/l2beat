-- Replace the per-blob "Blob" cache with a per-transaction "TxWithBlobs" cache:
-- one row per blob-carrying tx, with "blobCount" holding the multiplicity.
-- Every other column of "Blob" was transaction-level already, so the old table
-- stored identical tx metadata once per blob (~2.5-3x rows). "size" is dropped:
-- it was always NULL for ethereum rows and is recomputed as
-- blobCount * 131072 (ETHEREUM_BLOB_SIZE_BYTES) on read.
--
-- Lock ordering matters. We take an EXCLUSIVE lock on "Blob" FIRST, before the
-- backfill snapshot. Old backend pods still running the previous code block on
-- this lock when inserting and then fail loudly after we commit (the table is
-- gone); BlobIndexer's infinite retry strategy freezes its safe height until
-- the new code deploys and resumes against "TxWithBlobs". This closes the
-- window in which old code could commit rows to "Blob" AFTER the backfill read
-- it (those rows would otherwise be silently dropped). EXCLUSIVE (not ACCESS
-- EXCLUSIVE) still allows old readers (DaIndexer cache reads, the blob
-- notifier) to proceed while the backfill runs.
LOCK TABLE "Blob" IN EXCLUSIVE MODE;

-- CreateTable
CREATE TABLE "TxWithBlobs" (
    "id" SERIAL NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "daLayer" INTEGER NOT NULL,
    "from" VARCHAR(255) NOT NULL,
    "to" VARCHAR(255),
    "txHash" VARCHAR(255),
    "blobCount" INTEGER NOT NULL,
    "logs" JSONB,
    "topics" TEXT,

    CONSTRAINT "TxWithBlobs_pkey" PRIMARY KEY ("id")
);

-- Backfill (~25M source rows, back to block 19,426,618). "txHash" and "logs"
-- stay NULL to mark these as legacy rows; readers fall back to the legacy
-- "topics" column for them. Per-blob rows of one tx always share one identical
-- topics string (written by a single JSON.stringify), so a tx never splits
-- across groups. Different txs in one block with identical (from, to, topics)
-- merge into one row - acceptable: "blobCount" preserves the total and
-- matching only uses (from, to, topics), which are identical.
INSERT INTO "TxWithBlobs"
  ("blockNumber", "timestamp", "daLayer", "from", "to", "blobCount", "topics")
SELECT
  "blockNumber", "timestamp", "daLayer", "from", "to",
  count(*)::int, "topics"
FROM "Blob"
GROUP BY "blockNumber", "timestamp", "daLayer", "from", "to", "topics";

-- Safety check: total blob multiplicity must be preserved, otherwise abort the
-- whole migration transaction.
DO $$
DECLARE
  source_rows bigint;
  migrated_blobs bigint;
BEGIN
  SELECT count(*) INTO source_rows FROM "Blob";
  SELECT coalesce(sum("blobCount"), 0) INTO migrated_blobs FROM "TxWithBlobs";
  IF source_rows <> migrated_blobs THEN
    RAISE EXCEPTION 'Blob backfill mismatch: % source rows vs % blobCount',
      source_rows, migrated_blobs;
  END IF;
END $$;

-- CreateIndex (after the bulk insert, so each index is built once).
-- (daLayer, timestamp) is new: the daily notifier query filters on exactly
-- this pair and used to seq-scan the per-blob table.
CREATE INDEX "TxWithBlobs_blockNumber_idx" ON "TxWithBlobs"("blockNumber");
CREATE INDEX "TxWithBlobs_daLayer_timestamp_idx" ON "TxWithBlobs"("daLayer", "timestamp");

-- DropTable (also drops "Blob_id_seq" and "Blob_blockNumber_idx")
DROP TABLE "Blob";
