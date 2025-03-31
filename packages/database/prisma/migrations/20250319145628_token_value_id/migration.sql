/*
  Warnings:

  - Added the required column `tokenId` to the `TokenValue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TokenValue" ADD COLUMN     "tokenId" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE INDEX "TokenValue_tokenId_idx" ON "TokenValue"("tokenId");
