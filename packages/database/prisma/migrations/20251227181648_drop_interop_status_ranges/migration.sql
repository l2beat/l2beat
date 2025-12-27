/*
  Warnings:

  - You are about to drop the column `syncedBlockRanges` on the `InteropPluginStatus` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InteropPluginStatus" DROP COLUMN "syncedBlockRanges";
