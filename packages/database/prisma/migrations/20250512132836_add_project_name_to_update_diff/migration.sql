/*
  Warnings:

  - A unique constraint covering the columns `[projectName,address,type]` on the table `UpdateDiff` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `projectName` to the `UpdateDiff` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UpdateDiff_address_key";

-- AlterTable
ALTER TABLE "UpdateDiff" ADD COLUMN     "projectName" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UpdateDiff_projectName_address_type_key" ON "UpdateDiff"("projectName", "address", "type");
