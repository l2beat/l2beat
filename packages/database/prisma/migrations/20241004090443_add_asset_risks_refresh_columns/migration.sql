-- AlterTable
ALTER TABLE "AssetRisksUser" ADD COLUMN     "balancesRefreshedAt" TIMESTAMP(3),
ADD COLUMN     "tokensRefreshedAt" TIMESTAMP(3);
