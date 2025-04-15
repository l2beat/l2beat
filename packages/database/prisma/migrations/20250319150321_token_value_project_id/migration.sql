/*
  Warnings:

  - You are about to drop the column `project` on the `TokenValue` table. All the data in the column will be lost.
  - Added the required column `projectId` to the `TokenValue` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "TokenValue_project_idx";

-- AlterTable
ALTER TABLE "TokenValue" DROP COLUMN "project",
ADD COLUMN     "projectId" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE INDEX "TokenValue_projectId_idx" ON "TokenValue"("projectId");
