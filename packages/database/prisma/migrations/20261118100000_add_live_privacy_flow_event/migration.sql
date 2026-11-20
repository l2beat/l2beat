-- CreateTable
CREATE TABLE "ChainHeadCursor" (
    "indexerId" VARCHAR(255) NOT NULL,
    "chain" VARCHAR(64) NOT NULL,
    "sinceNumber" INTEGER NOT NULL,
    "sinceTimestamp" TIMESTAMP(6) NOT NULL,
    "startedAt" TIMESTAMP(6) NOT NULL,
    "number" INTEGER NOT NULL,
    "hash" VARCHAR(66) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "ChainHeadCursor_pkey" PRIMARY KEY ("indexerId")
);

-- CreateTable
CREATE TABLE "LivePrivacyFlowEvent" (
    "configurationId" CHAR(12) NOT NULL,
    "projectId" VARCHAR(255) NOT NULL,
    "bucketId" VARCHAR(255) NOT NULL,
    "chain" VARCHAR(32) NOT NULL,
    "direction" VARCHAR(16) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "blockHash" VARCHAR(66) NOT NULL,
    "txHash" VARCHAR(66) NOT NULL,
    "logIndex" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "amount" DECIMAL(80,0) NOT NULL,

    CONSTRAINT "LivePrivacyFlowEvent_pkey" PRIMARY KEY ("configurationId","txHash","logIndex")
);

-- CreateIndex
CREATE INDEX "LivePrivacyFlowEvent_chain_blockNumber_idx" ON "LivePrivacyFlowEvent"("chain", "blockNumber");

-- CreateIndex
CREATE INDEX "LivePrivacyFlowEvent_projectId_timestamp_idx" ON "LivePrivacyFlowEvent"("projectId", "timestamp");
