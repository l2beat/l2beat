/*
  Warnings:

  - You are about to drop the column `grouped` on the `BridgeEvent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BridgeEvent" DROP COLUMN "grouped",
ADD COLUMN     "unsupported" BOOLEAN NOT NULL DEFAULT false;
