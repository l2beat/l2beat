/*
  Warnings:

  - A unique constraint covering the columns `[serialId]` on the table `InteropTransfer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "DeployedToken" ADD COLUMN     "abstractTokenAssignmentProof" JSONB;

-- AlterTable
ALTER TABLE "InteropTransfer" ADD COLUMN     "serialId" BIGSERIAL NOT NULL;

-- CreateTable
CREATE TABLE "TokenIngestionQueue" (
    "chain" VARCHAR(32) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "state" VARCHAR(32) NOT NULL DEFAULT 'pending',
    "message" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "TokenIngestionQueue_pkey" PRIMARY KEY ("chain","address")
);

-- CreateTable
CREATE TABLE "TokenDbSettings" (
    "key" VARCHAR(255) NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "TokenDbSettings_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "TokenDbHistory" (
    "id" BIGSERIAL NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "source" VARCHAR(32) NOT NULL,
    "userEmail" VARCHAR(255),
    "commandType" VARCHAR(64) NOT NULL,
    "command" JSONB NOT NULL,
    "ingestionLog" TEXT,

    CONSTRAINT "TokenDbHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TokenIngestionQueue_state_updatedAt_idx" ON "TokenIngestionQueue"("state", "updatedAt");

-- CreateIndex
CREATE INDEX "TokenDbHistory_timestamp_idx" ON "TokenDbHistory"("timestamp");

-- CreateIndex
CREATE INDEX "TokenDbHistory_commandType_timestamp_idx" ON "TokenDbHistory"("commandType", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "InteropTransfer_serialId_key" ON "InteropTransfer"("serialId");
