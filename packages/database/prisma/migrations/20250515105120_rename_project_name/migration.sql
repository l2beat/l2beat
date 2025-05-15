-- Step 1: Add the new column as nullable
ALTER TABLE "FlatSources" ADD COLUMN "projectId" TEXT;
ALTER TABLE "UpdateDiff" ADD COLUMN "projectId" TEXT;
ALTER TABLE "UpdateMessage" ADD COLUMN "projectId" TEXT;
ALTER TABLE "UpdateMonitor" ADD COLUMN "projectId" TEXT;
ALTER TABLE "UpdateNotifier" ADD COLUMN "projectId" TEXT;

-- Step 2: Copy data from old column to new column
UPDATE "FlatSources" SET "projectId" = "projectName";
UPDATE "UpdateDiff" SET "projectId" = "projectName";
UPDATE "UpdateMessage" SET "projectId" = "projectName";
UPDATE "UpdateMonitor" SET "projectId" = "projectName";
UPDATE "UpdateNotifier" SET "projectId" = "projectName";

-- Step 3: Make the new column required
ALTER TABLE "FlatSources" ALTER COLUMN "projectId" SET NOT NULL;
ALTER TABLE "UpdateDiff" ALTER COLUMN "projectId" SET NOT NULL;
ALTER TABLE "UpdateMessage" ALTER COLUMN "projectId" SET NOT NULL;
ALTER TABLE "UpdateMonitor" ALTER COLUMN "projectId" SET NOT NULL;
ALTER TABLE "UpdateNotifier" ALTER COLUMN "projectId" SET NOT NULL;

-- Step 4: Drop indexes that depend on the old column
DROP INDEX IF EXISTS "UpdateDiff_projectName_address_type_chain_key";
DROP INDEX IF EXISTS "UpdateNotifier_projectName_idx";

-- Step 5: Drop primary key constraints
ALTER TABLE "FlatSources" DROP CONSTRAINT IF EXISTS "FlatSources_pkey";
ALTER TABLE "UpdateMessage" DROP CONSTRAINT IF EXISTS "UpdateMessage_pkey";
ALTER TABLE "UpdateMonitor" DROP CONSTRAINT IF EXISTS "UpdateMonitor_pkey";

-- Step 6: Drop the old column
ALTER TABLE "FlatSources" DROP COLUMN "projectName";
ALTER TABLE "UpdateDiff" DROP COLUMN "projectName";
ALTER TABLE "UpdateMessage" DROP COLUMN "projectName";
ALTER TABLE "UpdateMonitor" DROP COLUMN "projectName";
ALTER TABLE "UpdateNotifier" DROP COLUMN "projectName";

-- Step 7: Add new primary key constraints
ALTER TABLE "FlatSources" ADD CONSTRAINT "FlatSources_pkey" PRIMARY KEY ("projectId", "chainId");
ALTER TABLE "UpdateMessage" ADD CONSTRAINT "UpdateMessage_pkey" PRIMARY KEY ("projectId", "chain", "blockNumber");
ALTER TABLE "UpdateMonitor" ADD CONSTRAINT "UpdateMonitor_pkey" PRIMARY KEY ("projectId", "chainId");

-- Step 8: Ensure the column type is correct (VARCHAR(255) instead of TEXT if needed)
ALTER TABLE "FlatSources" ALTER COLUMN "projectId" TYPE VARCHAR(255);
ALTER TABLE "UpdateDiff" ALTER COLUMN "projectId" TYPE VARCHAR(255);
ALTER TABLE "UpdateMessage" ALTER COLUMN "projectId" TYPE VARCHAR(255);
ALTER TABLE "UpdateMonitor" ALTER COLUMN "projectId" TYPE VARCHAR(255);
ALTER TABLE "UpdateNotifier" ALTER COLUMN "projectId" TYPE VARCHAR(255);

-- Step 9: Create new indexes
CREATE UNIQUE INDEX "UpdateDiff_projectId_address_type_chain_key" ON "UpdateDiff"("projectId", "address", "type", "chain");
CREATE INDEX "UpdateNotifier_projectId_idx" ON "UpdateNotifier"("projectId");
