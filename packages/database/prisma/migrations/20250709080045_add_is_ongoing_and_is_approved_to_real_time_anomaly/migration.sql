-- AlterTable
ALTER TABLE "RealTimeAnomaly" ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isOngoing" BOOLEAN NOT NULL DEFAULT false;
