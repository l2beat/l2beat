-- AlterTable
ALTER TABLE "BridgeTransfer" ADD COLUMN     "dstAbstractTokenId" VARCHAR(66),
ADD COLUMN     "isProcessed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "srcAbstractTokenId" VARCHAR(66);
