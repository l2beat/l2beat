/*
  Warnings:

  - The primary key for the `ProjectValue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `type` on the `ProjectValue` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ProjectValueType" AS ENUM ('PROJECT', 'PROJECT_WA', 'SUMMARY', 'SUMMARY_WA');

-- AlterTable
ALTER TABLE "ProjectValue" DROP CONSTRAINT "ProjectValue_pkey",
DROP COLUMN "type",
ADD COLUMN     "type" "ProjectValueType" NOT NULL,
ADD CONSTRAINT "ProjectValue_pkey" PRIMARY KEY ("timestamp", "project", "type");
