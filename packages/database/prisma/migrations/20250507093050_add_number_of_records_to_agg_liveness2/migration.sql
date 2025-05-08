/*
  Warnings:

  - Added the required column `numberOfRecords` to the `AggregatedLiveness2` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AggregatedLiveness2" ADD COLUMN     "numberOfRecords" INTEGER NOT NULL;
