-- CreateTable
CREATE TABLE "InteropRecentPrices" (
    "coingeckoId" VARCHAR(64) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "priceUsd" REAL NOT NULL,

    CONSTRAINT "InteropRecentPrices_pkey" PRIMARY KEY ("coingeckoId","timestamp")
);

-- CreateIndex
CREATE INDEX "InteropRecentPrices_timestamp_idx" ON "InteropRecentPrices"("timestamp");
