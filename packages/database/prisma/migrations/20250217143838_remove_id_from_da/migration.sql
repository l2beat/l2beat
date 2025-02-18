/*
  Warnings:

  - The primary key for the `DataAvailability` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `configurationId` on the `DataAvailability` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DataAvailability" DROP CONSTRAINT "DataAvailability_pkey",
DROP COLUMN "configurationId",
ADD CONSTRAINT "DataAvailability_pkey" PRIMARY KEY ("timestamp", "daLayer", "projectId");
