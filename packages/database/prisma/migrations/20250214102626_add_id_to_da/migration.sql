/*
  Warnings:

  - The primary key for the `DataAvailability` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `configurationId` to the `DataAvailability` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DataAvailability" DROP CONSTRAINT "DataAvailability_pkey",
ADD COLUMN     "configurationId" CHAR(12) NOT NULL,
ADD CONSTRAINT "DataAvailability_pkey" PRIMARY KEY ("timestamp", "configurationId");
