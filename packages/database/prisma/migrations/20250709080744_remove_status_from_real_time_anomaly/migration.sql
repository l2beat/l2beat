/*
  Warnings:

  - You are about to drop the column `status` on the `RealTimeAnomaly` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RealTimeAnomaly" DROP COLUMN "status",
ALTER COLUMN "isApproved" DROP DEFAULT,
ALTER COLUMN "isOngoing" DROP DEFAULT;
