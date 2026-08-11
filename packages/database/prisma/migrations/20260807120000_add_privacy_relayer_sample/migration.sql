-- CreateTable
CREATE TABLE "PrivacyRelayerSample" (
    "configurationId" CHAR(12) NOT NULL,
    "projectId" VARCHAR(255) NOT NULL,
    "chain" VARCHAR(32) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "relayerCount" INTEGER NOT NULL,

    CONSTRAINT "PrivacyRelayerSample_pkey" PRIMARY KEY ("configurationId", "timestamp")
);

-- CreateIndex
CREATE INDEX "PrivacyRelayerSample_projectId_timestamp_idx" ON "PrivacyRelayerSample"("projectId", "timestamp");
