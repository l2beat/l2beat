-- CreateTable
CREATE TABLE "TvsEscrowValue" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "configurationId" CHAR(12) NOT NULL,
    "projectId" VARCHAR(255) NOT NULL,
    "tokenId" VARCHAR(255) NOT NULL,
    "chain" VARCHAR(255) NOT NULL,
    "escrowAddress" VARCHAR(255) NOT NULL,
    "amount" REAL NOT NULL,
    "value" REAL NOT NULL,

    CONSTRAINT "TvsEscrowValue_pkey" PRIMARY KEY ("timestamp","configurationId","chain","escrowAddress")
);

-- CreateIndex
CREATE INDEX "TvsEscrowValue_configurationId_idx" ON "TvsEscrowValue"("configurationId");

-- CreateIndex
CREATE INDEX "TvsEscrowValue_projectId_timestamp_idx" ON "TvsEscrowValue"("projectId", "timestamp");
