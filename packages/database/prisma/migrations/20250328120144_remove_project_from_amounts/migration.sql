/*
  Warnings:

  - You are about to drop the column `project` on the `TvsAmount` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "TvsAmount_project_idx";

-- AlterTable
ALTER TABLE "TvsAmount" DROP COLUMN "project";
