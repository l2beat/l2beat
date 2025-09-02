/*
  Warnings:

  - The primary key for the `FlatSources` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `chainId` on the `FlatSources` table. All the data in the column will be lost.
  - You are about to drop the column `chain` on the `UpdateDiff` table. All the data in the column will be lost.
  - The primary key for the `UpdateMessage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `chain` on the `UpdateMessage` table. All the data in the column will be lost.
  - The primary key for the `UpdateMonitor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `chainId` on the `UpdateMonitor` table. All the data in the column will be lost.
  - You are about to drop the column `chainId` on the `UpdateNotifier` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectId,address,type]` on the table `UpdateDiff` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UpdateDiff_projectId_address_type_chain_key";

-- AlterTable
ALTER TABLE "FlatSources" DROP CONSTRAINT "FlatSources_pkey",
DROP COLUMN "chainId",
ADD CONSTRAINT "FlatSources_pkey" PRIMARY KEY ("projectId");

-- AlterTable
ALTER TABLE "UpdateDiff" DROP COLUMN "chain";

-- AlterTable
ALTER TABLE "UpdateMessage" DROP CONSTRAINT "UpdateMessage_pkey",
DROP COLUMN "chain",
ADD CONSTRAINT "UpdateMessage_pkey" PRIMARY KEY ("projectId", "timestamp");

-- AlterTable
ALTER TABLE "UpdateMonitor" DROP CONSTRAINT "UpdateMonitor_pkey",
DROP COLUMN "chainId",
ADD CONSTRAINT "UpdateMonitor_pkey" PRIMARY KEY ("projectId");

-- AlterTable
ALTER TABLE "UpdateNotifier" DROP COLUMN "chainId";

-- CreateIndex
CREATE UNIQUE INDEX "UpdateDiff_projectId_address_type_key" ON "UpdateDiff"("projectId", "address", "type");
