-- CreateTable
CREATE TABLE "EcosystemToken" (
    "projectId" VARCHAR(255) NOT NULL,
    "coingeckoId" VARCHAR(255) NOT NULL,
    "priceUsd" REAL NOT NULL,
    "marketCapUsd" REAL NOT NULL,
    "circulatingSupply" REAL NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "EcosystemToken_pkey" PRIMARY KEY ("projectId","coingeckoId")
);

-- CreateIndex
CREATE INDEX "EcosystemToken_projectId_idx" ON "EcosystemToken"("projectId");

-- CreateIndex
CREATE INDEX "EcosystemToken_coingeckoId_idx" ON "EcosystemToken"("coingeckoId");
