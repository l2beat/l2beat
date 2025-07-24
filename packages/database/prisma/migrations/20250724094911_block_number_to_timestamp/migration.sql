/*
  Warnings:

  - You are about to drop the column `blockNumber` on the `FlatSources` table. All the data in the column will be lost.
  - You are about to drop the column `diffBaseBlockNumber` on the `UpdateDiff` table. All the data in the column will be lost.
  - You are about to drop the column `diffHeadBlockNumber` on the `UpdateDiff` table. All the data in the column will be lost.
  - The primary key for the `UpdateMessage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `blockNumber` on the `UpdateMessage` table. All the data in the column will be lost.
  - You are about to drop the column `blockNumber` on the `UpdateMonitor` table. All the data in the column will be lost.
  - You are about to drop the column `blockNumber` on the `UpdateNotifier` table. All the data in the column will be lost.
  - Added the required column `timestamp` to the `FlatSources` table without a default value. This is not possible if the table is not empty.
  - Added the required column `diffBaseTimestamp` to the `UpdateDiff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `diffHeadTimestamp` to the `UpdateDiff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestamp` to the `UpdateNotifier` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UpdateNotifier_blockNumber_idx";

-- AlterTable
ALTER TABLE "FlatSources" DROP COLUMN "blockNumber",
ADD COLUMN     "timestamp" TIMESTAMP(6) NOT NULL;

-- AlterTable
ALTER TABLE "UpdateDiff" DROP COLUMN "diffBaseBlockNumber",
DROP COLUMN "diffHeadBlockNumber",
ADD COLUMN     "diffBaseTimestamp" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "diffHeadTimestamp" TIMESTAMP(6) NOT NULL;

-- AlterTable
ALTER TABLE "UpdateMessage" DROP CONSTRAINT "UpdateMessage_pkey",
DROP COLUMN "blockNumber",
ADD CONSTRAINT "UpdateMessage_pkey" PRIMARY KEY ("projectId", "chain", "timestamp");

-- AlterTable
ALTER TABLE "UpdateMonitor" DROP COLUMN "blockNumber";

-- AlterTable
ALTER TABLE "UpdateNotifier" DROP COLUMN "blockNumber",
ADD COLUMN     "timestamp" TIMESTAMP(6) NOT NULL;

-- CreateIndex
CREATE INDEX "UpdateNotifier_timestamp_idx" ON "UpdateNotifier"("timestamp");
