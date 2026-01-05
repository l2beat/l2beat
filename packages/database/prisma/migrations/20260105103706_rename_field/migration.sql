/*
  Warnings:

  - You are about to drop the column `resyncRequestedAt` on the `InteropPluginSyncState` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InteropPluginSyncState" DROP COLUMN "resyncRequestedAt",
ADD COLUMN     "resyncRequestedFrom" TIMESTAMP(6);
