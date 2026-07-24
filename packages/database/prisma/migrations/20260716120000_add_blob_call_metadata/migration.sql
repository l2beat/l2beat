-- These columns are nullable so the migration remains compatible with the
-- currently deployed backend while blob_indexer_v2 replaces cached ranges.
BEGIN;

ALTER TABLE "Blob"
ADD COLUMN "callSelector" VARCHAR(10),
ADD COLUMN "callFirstParameter" VARCHAR(66);

COMMIT;
