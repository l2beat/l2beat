-- CreateTable
CREATE TABLE "EcosystemToken" (
    "projectId" VARCHAR(255) NOT NULL,
    "coingeckoId" VARCHAR(255) NOT NULL,
    "configurationId" VARCHAR(12) NOT NULL,
    "priceUsd" REAL NOT NULL,
    "price7dChange" REAL NOT NULL,
    "marketCapUsd" REAL NOT NULL,
    "marketCap7dChange" REAL NOT NULL,
    "circulatingSupply" REAL NOT NULL,
    "circulatingSupply7dChange" REAL NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "EcosystemToken_pkey" PRIMARY KEY ("projectId","coingeckoId","configurationId")
);

-- CreateIndex
CREATE INDEX "EcosystemToken_projectId_idx" ON "EcosystemToken"("projectId");
