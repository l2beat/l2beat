/*
  Warnings:

  - The primary key for the `values` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "values" DROP CONSTRAINT "values_pkey",
ADD CONSTRAINT "values_pkey" PRIMARY KEY ("project_id", "timestamp", "data_source");
