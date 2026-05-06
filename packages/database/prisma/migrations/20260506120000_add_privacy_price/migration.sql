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
