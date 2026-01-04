/*
  Warnings:

  - You are about to drop the column `lastError` on the `InteropPluginSyncedRange` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InteropPluginSyncedRange" DROP COLUMN "lastError";

-- CreateTable
CREATE TABLE "InteropPluginSyncState" (
    "pluginName" VARCHAR(255) NOT NULL,
    "chain" VARCHAR(255) NOT NULL,
    "lastError" TEXT,

    CONSTRAINT "InteropPluginSyncState_pkey" PRIMARY KEY ("pluginName","chain")
);
