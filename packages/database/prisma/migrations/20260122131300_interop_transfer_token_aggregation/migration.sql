/*
  Warnings:

  - You are about to drop the column `tokensByVolume` on the `AggregatedInteropTransfer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AggregatedInteropTransfer" DROP COLUMN "tokensByVolume";

-- CreateTable
CREATE TABLE "AggregatedInteropToken" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "id" VARCHAR(255) NOT NULL,
    "srcChain" VARCHAR(255) NOT NULL,
    "dstChain" VARCHAR(255) NOT NULL,
    "abstractTokenId" VARCHAR(6) NOT NULL,
    "transferCount" INTEGER NOT NULL,
    "totalDurationSum" INTEGER NOT NULL,
    "volume" REAL NOT NULL,

    CONSTRAINT "AggregatedInteropToken_pkey" PRIMARY KEY ("timestamp","srcChain","dstChain","abstractTokenId","id")
);
