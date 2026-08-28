-- The old grouping index treats every non-null value as grouped, so it must
-- be gone before ungrouped records receive the 'none' sentinel; otherwise the
-- backfill below would violate its uniqueness. Its replacement (previous
-- migration) excludes 'none'.
DROP INDEX "Liveness_configurationId_groupingKey_key";

-- Rewrites every previously ungrouped row (~15.6M in production).
UPDATE "Liveness"
SET "groupingKey" = 'none'
WHERE "groupingKey" IS NULL;

ALTER TABLE "Liveness"
ALTER COLUMN "groupingKey" SET NOT NULL,
ALTER COLUMN "groupingKey" SET DEFAULT 'none';
