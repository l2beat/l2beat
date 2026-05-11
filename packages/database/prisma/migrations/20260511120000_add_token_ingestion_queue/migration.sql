-- CreateTable
CREATE TABLE "TokenIngestionQueueEntry" (
    "chain" VARCHAR(32) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "state" VARCHAR(32) NOT NULL DEFAULT 'pending',
    "message" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "TokenIngestionQueueEntry_pkey" PRIMARY KEY ("chain","address")
);

-- CreateIndex
CREATE INDEX "TokenIngestionQueueEntry_state_updatedAt_idx" ON "TokenIngestionQueueEntry"("state", "updatedAt");
