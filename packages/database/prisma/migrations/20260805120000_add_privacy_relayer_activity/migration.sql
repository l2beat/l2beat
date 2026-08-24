-- CreateTable
CREATE TABLE "PrivacyRelayerActivity" (
    "configurationId" CHAR(12) NOT NULL,
    "projectId" VARCHAR(255) NOT NULL,
    "chain" VARCHAR(32) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "txHash" VARCHAR(66) NOT NULL,
    "logIndex" INTEGER NOT NULL,
    "relayerAddress" VARCHAR(42) NOT NULL,

    CONSTRAINT "PrivacyRelayerActivity_pkey" PRIMARY KEY ("configurationId", "txHash", "logIndex")
);

-- CreateIndex
CREATE INDEX "PrivacyRelayerActivity_projectId_timestamp_relayerAddress_idx" ON "PrivacyRelayerActivity"("projectId", "timestamp", "relayerAddress");

-- CreateIndex
CREATE INDEX "PrivacyRelayerActivity_configurationId_timestamp_idx" ON "PrivacyRelayerActivity"("configurationId", "timestamp");
