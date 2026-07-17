-- AlterTable
ALTER TABLE "Liveness" ADD COLUMN "groupingKey" VARCHAR(255);

-- AlterTable
ALTER TABLE "RealTimeLiveness" ADD COLUMN "groupingKey" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "Liveness_configurationId_groupingKey_key" ON "Liveness"("configurationId", "groupingKey") WHERE "groupingKey" IS NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RealTimeLiveness_configurationId_groupingKey_key" ON "RealTimeLiveness"("configurationId", "groupingKey") WHERE "groupingKey" IS NOT NULL;
