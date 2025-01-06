/*
  Warnings:

  - You are about to drop the column `blockNumber` on the `DiscoveryCache` table. All the data in the column will be lost.
  - You are about to drop the column `chain` on the `DiscoveryCache` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DiscoveryCache" DROP COLUMN "blockNumber",
DROP COLUMN "chain";
