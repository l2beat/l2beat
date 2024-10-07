-- AlterTable
ALTER TABLE "TokenMeta" ALTER COLUMN "symbol" SET DATA TYPE VARCHAR(256);

-- CreateTable
CREATE TABLE "AssetRisksUser" (
    "id" CHAR(21) NOT NULL,
    "address" CHAR(42) NOT NULL,
    "tokensRefreshedAt" TIMESTAMP(3),
    "balancesRefreshedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssetRisksUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetRisksBalance" (
    "id" CHAR(21) NOT NULL,
    "userId" CHAR(21) NOT NULL,
    "tokenId" CHAR(21) NOT NULL,
    "balance" DECIMAL(80,0) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssetRisksBalance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AssetRisksUser_address_key" ON "AssetRisksUser"("address");

-- CreateIndex
CREATE UNIQUE INDEX "AssetRisksBalance_tokenId_userId_key" ON "AssetRisksBalance"("tokenId", "userId");

-- AddForeignKey
ALTER TABLE "AssetRisksBalance" ADD CONSTRAINT "AssetRisksBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "AssetRisksUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetRisksBalance" ADD CONSTRAINT "AssetRisksBalance_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
