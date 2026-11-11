-- CreateTable
CREATE TABLE "LiquidStakingSnapshot" (
    "configurationId" CHAR(12) NOT NULL,
    "projectId" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "exchangeRate" DECIMAL(80,0) NOT NULL,
    "lastRequestId" INTEGER,
    "lastFinalizedRequestId" INTEGER,
    "instantExitEth" DECIMAL(80,0),
    "instantExitFeeBps" INTEGER,
    "lockTime" INTEGER,
    "marketExitEth" DECIMAL(80,0),
    "marketExitValueEth" DECIMAL(80,0),

    CONSTRAINT "LiquidStakingSnapshot_pkey" PRIMARY KEY ("configurationId","timestamp")
);

-- CreateIndex
CREATE INDEX "LiquidStakingSnapshot_projectId_timestamp_idx" ON "LiquidStakingSnapshot"("projectId", "timestamp");
