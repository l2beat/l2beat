/*
  Warnings:

  - The primary key for the `AggregatedInteropToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `AggregatedInteropTransfer` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "AggregatedInteropToken" DROP CONSTRAINT "AggregatedInteropToken_pkey",
ADD COLUMN     "bridgeType" VARCHAR(255) NOT NULL DEFAULT 'unknown',
ADD CONSTRAINT "AggregatedInteropToken_pkey" PRIMARY KEY ("timestamp", "srcChain", "dstChain", "bridgeType", "id", "abstractTokenId");

-- AlterTable
ALTER TABLE "AggregatedInteropTransfer" DROP CONSTRAINT "AggregatedInteropTransfer_pkey",
ADD COLUMN     "bridgeType" VARCHAR(255) NOT NULL DEFAULT 'unknown',
ADD CONSTRAINT "AggregatedInteropTransfer_pkey" PRIMARY KEY ("timestamp", "srcChain", "dstChain", "bridgeType", "id");
