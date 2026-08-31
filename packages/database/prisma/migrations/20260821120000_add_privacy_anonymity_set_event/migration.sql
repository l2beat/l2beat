-- CreateTable
CREATE TABLE "PrivacyAnonymitySetEvent" (
    "configurationId" CHAR(12) NOT NULL,
    "projectId" VARCHAR(255) NOT NULL,
    "bucketId" VARCHAR(255) NOT NULL,
    "chain" VARCHAR(32) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "txHash" VARCHAR(66) NOT NULL,
    "logIndex" INTEGER NOT NULL,
    "sender" VARCHAR(42) NOT NULL,
    "amount" DECIMAL(80,0) NOT NULL,

    CONSTRAINT "PrivacyAnonymitySetEvent_pkey" PRIMARY KEY ("configurationId","txHash","logIndex")
);

-- CreateIndex
CREATE INDEX "PrivacyAnonymitySetEvent_projectId_bucketId_timestamp_idx" ON "PrivacyAnonymitySetEvent"("projectId", "bucketId", "timestamp");

-- CreateIndex
CREATE INDEX "PrivacyAnonymitySetEvent_configurationId_blockNumber_idx" ON "PrivacyAnonymitySetEvent"("configurationId", "blockNumber");

-- CreateIndex
CREATE INDEX "PrivacyAnonymitySetEvent_configurationId_timestamp_idx" ON "PrivacyAnonymitySetEvent"("configurationId", "timestamp");
