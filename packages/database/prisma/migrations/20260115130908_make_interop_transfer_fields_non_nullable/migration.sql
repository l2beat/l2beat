/*
  Warnings:

  - Made the column `duration` on table `InteropTransfer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `srcTime` on table `InteropTransfer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `srcChain` on table `InteropTransfer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `srcTxHash` on table `InteropTransfer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `srcLogIndex` on table `InteropTransfer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `srcEventId` on table `InteropTransfer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dstTime` on table `InteropTransfer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dstChain` on table `InteropTransfer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dstTxHash` on table `InteropTransfer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dstLogIndex` on table `InteropTransfer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dstEventId` on table `InteropTransfer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "InteropTransfer" ALTER COLUMN "duration" SET NOT NULL,
ALTER COLUMN "srcTime" SET NOT NULL,
ALTER COLUMN "srcChain" SET NOT NULL,
ALTER COLUMN "srcTxHash" SET NOT NULL,
ALTER COLUMN "srcLogIndex" SET NOT NULL,
ALTER COLUMN "srcEventId" SET NOT NULL,
ALTER COLUMN "dstTime" SET NOT NULL,
ALTER COLUMN "dstChain" SET NOT NULL,
ALTER COLUMN "dstTxHash" SET NOT NULL,
ALTER COLUMN "dstLogIndex" SET NOT NULL,
ALTER COLUMN "dstEventId" SET NOT NULL;
