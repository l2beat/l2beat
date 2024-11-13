/*
  Warnings:

  - You are about to drop the `AssetRisksBalance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AssetRisksUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AssetRisksBalance" DROP CONSTRAINT "AssetRisksBalance_tokenId_fkey";

-- DropForeignKey
ALTER TABLE "AssetRisksBalance" DROP CONSTRAINT "AssetRisksBalance_userId_fkey";

-- DropTable
DROP TABLE "AssetRisksBalance";

-- DropTable
DROP TABLE "AssetRisksUser";

-- CreateTable
CREATE TABLE "InsightUser" (
    "id" CHAR(21) NOT NULL,
    "address" CHAR(42) NOT NULL,
    "tokensRefreshedAt" TIMESTAMP(3),
    "balancesRefreshedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InsightUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsightBalance" (
    "id" CHAR(21) NOT NULL,
    "userId" CHAR(21) NOT NULL,
    "tokenId" CHAR(21) NOT NULL,
    "balance" DECIMAL(80,0) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InsightBalance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InsightUser_address_key" ON "InsightUser"("address");

-- CreateIndex
CREATE UNIQUE INDEX "InsightBalance_tokenId_userId_key" ON "InsightBalance"("tokenId", "userId");

-- AddForeignKey
ALTER TABLE "InsightBalance" ADD CONSTRAINT "InsightBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "InsightUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsightBalance" ADD CONSTRAINT "InsightBalance_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
