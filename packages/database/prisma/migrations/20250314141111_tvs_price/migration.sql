-- CreateTable
CREATE TABLE "TvsPrice" (
    "configurationId" CHAR(12) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "priceUsd" REAL NOT NULL,
    "priceId" VARCHAR(255) NOT NULL,

    CONSTRAINT "TvsPrice_pkey" PRIMARY KEY ("configurationId","timestamp")
);

-- CreateIndex
CREATE INDEX "TvsPrice_priceId_idx" ON "TvsPrice"("priceId");
