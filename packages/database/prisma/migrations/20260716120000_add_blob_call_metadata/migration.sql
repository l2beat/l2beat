-- The Blob table is a derived cache. Rebuild it so historical rows include
-- call metadata required by calldata-based DA attribution.
BEGIN;

ALTER TABLE "Blob"
ADD COLUMN "callSelector" VARCHAR(10),
ADD COLUMN "callFirstParameter" VARCHAR(66);

TRUNCATE TABLE "Blob" RESTART IDENTITY;

COMMIT;
