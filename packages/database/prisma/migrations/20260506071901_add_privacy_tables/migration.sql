-- CreateTable
CREATE TABLE "PrivacyFlowEvent" (
    "configurationId" CHAR(12) NOT NULL,
    "projectId" VARCHAR(255) NOT NULL,
    "assetKey" VARCHAR(255) NOT NULL,
    "bucketId" VARCHAR(255) NOT NULL,
    "chain" VARCHAR(32) NOT NULL,
    "direction" VARCHAR(16) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "txHash" VARCHAR(66) NOT NULL,
    "logIndex" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "amount" DECIMAL(80,0) NOT NULL,

    CONSTRAINT "PrivacyFlowEvent_pkey" PRIMARY KEY ("configurationId","txHash","logIndex")
);

-- CreateIndex
CREATE INDEX "PrivacyFlowEvent_projectId_timestamp_idx" ON "PrivacyFlowEvent"("projectId", "timestamp");

-- CreateIndex
CREATE INDEX "PrivacyFlowEvent_projectId_assetKey_bucketId_timestamp_idx" ON "PrivacyFlowEvent"("projectId", "assetKey", "bucketId", "timestamp");

-- CreateIndex
CREATE INDEX "PrivacyFlowEvent_configurationId_blockNumber_idx" ON "PrivacyFlowEvent"("configurationId", "blockNumber");
