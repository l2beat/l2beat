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
