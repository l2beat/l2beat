/*
  Warnings:

  - You are about to drop the column `blockHash` on the `InteropEvent` table. All the data in the column will be lost.
  - You are about to drop the column `calldata` on the `InteropEvent` table. All the data in the column will be lost.
  - You are about to drop the column `logIndex` on the `InteropEvent` table. All the data in the column will be lost.
  - You are about to drop the column `txHash` on the `InteropEvent` table. All the data in the column will be lost.
  - You are about to drop the column `txTo` on the `InteropEvent` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `InteropEvent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InteropEvent" DROP COLUMN "blockHash",
DROP COLUMN "calldata",
DROP COLUMN "logIndex",
DROP COLUMN "txHash",
DROP COLUMN "txTo",
DROP COLUMN "value";
