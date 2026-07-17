-- AlterTable
ALTER TABLE "Liveness" ADD COLUMN "eventId" VARCHAR(255);
UPDATE "Liveness" SET "eventId" = "txHash";
ALTER TABLE "Liveness" ALTER COLUMN "eventId" SET NOT NULL;

-- AlterTable
ALTER TABLE "RealTimeLiveness" ADD COLUMN "eventId" VARCHAR(255);
UPDATE "RealTimeLiveness" SET "eventId" = "txHash";
ALTER TABLE "RealTimeLiveness" ALTER COLUMN "eventId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Liveness_configurationId_eventId_key" ON "Liveness"("configurationId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "RealTimeLiveness_configurationId_eventId_key" ON "RealTimeLiveness"("configurationId", "eventId");
