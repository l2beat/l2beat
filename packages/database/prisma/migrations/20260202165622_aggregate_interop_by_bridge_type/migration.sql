/*
  Warnings:

  - Added the required column `bridgeType` to the `AggregatedInteropToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bridgeType` to the `AggregatedInteropTransfer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AggregatedInteropToken" ADD COLUMN     "bridgeType" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "AggregatedInteropTransfer" ADD COLUMN     "bridgeType" VARCHAR(255) NOT NULL;
