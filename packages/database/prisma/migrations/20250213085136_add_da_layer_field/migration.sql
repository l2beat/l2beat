/*
  Warnings:

  - Added the required column `daLayer` to the `DataAvailability` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DataAvailability" ADD COLUMN     "daLayer" VARCHAR(255) NOT NULL;
