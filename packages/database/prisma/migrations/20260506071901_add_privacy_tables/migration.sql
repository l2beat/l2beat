-- CreateTable
CREATE TABLE "PrivacyFlowEvent" (
    "configurationId" CHAR(12) NOT NULL,
    "projectId" VARCHAR(255) NOT NULL,
    "bucketId" VARCHAR(255) NOT NULL,
    "chain" VARCHAR(32) NOT NULL,
    "direction" VARCHAR(16) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "txHash" VARCHAR(66) NOT NULL,
    "logIndex" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "amount" DECIMAL(80,0) NOT NULL,
    "priceId" VARCHAR(255) NOT NULL,
    "valueUsd" REAL NOT NULL,

    CONSTRAINT "PrivacyFlowEvent_pkey" PRIMARY KEY ("configurationId","txHash","logIndex")
);

-- CreateIndex
CREATE INDEX "PrivacyFlowEvent_projectId_timestamp_idx" ON "PrivacyFlowEvent"("projectId", "timestamp");

-- CreateIndex
CREATE INDEX "PrivacyFlowEvent_projectId_bucketId_timestamp_idx" ON "PrivacyFlowEvent"("projectId", "bucketId", "timestamp");

-- CreateIndex
CREATE INDEX "PrivacyFlowEvent_configurationId_blockNumber_idx" ON "PrivacyFlowEvent"("configurationId", "blockNumber");

-- CreateIndex
CREATE INDEX "PrivacyFlowEvent_configurationId_timestamp_idx" ON "PrivacyFlowEvent"("configurationId", "timestamp");

-- CreateTable
CREATE TABLE "PrivacyPrice" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "configurationId" CHAR(12) NOT NULL,
    "priceId" VARCHAR(255) NOT NULL,
    "priceUsd" REAL NOT NULL,

    CONSTRAINT "PrivacyPrice_pkey" PRIMARY KEY ("timestamp","configurationId")
);

-- CreateIndex
CREATE INDEX "PrivacyPrice_priceId_idx" ON "PrivacyPrice"("priceId");

-- CreateTable
CREATE TABLE "PrivacyBlockTimestamp" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "configurationId" CHAR(12) NOT NULL,
    "chain" VARCHAR(255) NOT NULL,
    "blockNumber" INTEGER NOT NULL,

    CONSTRAINT "PrivacyBlockTimestamp_pkey" PRIMARY KEY ("timestamp", "configurationId")
);

-- CreateIndex
CREATE INDEX "PrivacyBlockTimestamp_chain_idx" ON "PrivacyBlockTimestamp"("chain");
