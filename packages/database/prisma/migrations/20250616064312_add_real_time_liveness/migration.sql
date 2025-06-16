-- CreateTable
CREATE TABLE "RealTimeLiveness" (
    "configurationId" VARCHAR(12) NOT NULL,
    "txHash" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "blockNumber" INTEGER NOT NULL,

    CONSTRAINT "RealTimeLiveness_pkey" PRIMARY KEY ("configurationId","txHash")
);

-- CreateIndex
CREATE INDEX "RealTimeLiveness_configurationId_timestamp_idx" ON "RealTimeLiveness"("configurationId", "timestamp");
