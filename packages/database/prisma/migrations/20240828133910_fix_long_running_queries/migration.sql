/*
  Warnings:

  - The primary key for the `liveness` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `values` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "liveness" DROP CONSTRAINT "liveness_pkey",
ADD CONSTRAINT "liveness_pkey" PRIMARY KEY ("configuration_id", "timestamp", "tx_hash");

-- AlterTable
ALTER TABLE "values" DROP CONSTRAINT "values_pkey",
ADD CONSTRAINT "values_pkey" PRIMARY KEY ("project_id", "timestamp", "data_source");
