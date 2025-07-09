/*
  Warnings:

  - You are about to drop the column `status` on the `RealTimeAnomaly` table. All the data in the column will be lost.
  - Added the required column `isApproved` to the `RealTimeAnomaly` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isOngoing` to the `RealTimeAnomaly` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RealTimeAnomaly" DROP COLUMN "status",
ADD COLUMN     "isApproved" BOOLEAN NOT NULL,
ADD COLUMN     "isOngoing" BOOLEAN NOT NULL;
