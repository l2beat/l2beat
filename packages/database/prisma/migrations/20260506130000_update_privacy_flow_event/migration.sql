-- Drop old index that references assetKey
DROP INDEX IF EXISTS "PrivacyFlowEvent_projectId_assetKey_bucketId_timestamp_idx";

-- Add new index without assetKey
CREATE INDEX "PrivacyFlowEvent_projectId_bucketId_timestamp_idx" ON "PrivacyFlowEvent"("projectId", "bucketId", "timestamp");

-- Add new columns
ALTER TABLE "PrivacyFlowEvent" ADD COLUMN IF NOT EXISTS "priceId" VARCHAR(255) NOT NULL DEFAULT '';
ALTER TABLE "PrivacyFlowEvent" ADD COLUMN IF NOT EXISTS "valueUsd" REAL;

-- Remove assetKey column
ALTER TABLE "PrivacyFlowEvent" DROP COLUMN IF EXISTS "assetKey";

-- Remove the default from priceId after migration
ALTER TABLE "PrivacyFlowEvent" ALTER COLUMN "priceId" DROP DEFAULT;
