-- AlterTable
ALTER TABLE "LiveBlobBatch" ADD COLUMN     "nonce" INTEGER,
ADD COLUMN     "pendingSince" TIMESTAMP(6);

-- CreateTable
CREATE TABLE "LivePendingBlobTx" (
    "from" VARCHAR(255) NOT NULL,
    "nonce" INTEGER NOT NULL,
    "txHash" VARCHAR(66) NOT NULL,
    "to" VARCHAR(255) NOT NULL,
    "blobs" INTEGER NOT NULL,
    "projectId" VARCHAR(255),
    "firstSeenAt" TIMESTAMP(6) NOT NULL,
    "lastSeenAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "LivePendingBlobTx_pkey" PRIMARY KEY ("from","nonce")
);

-- CreateIndex
CREATE INDEX "LiveBlobBatch_from_nonce_idx" ON "LiveBlobBatch"("from", "nonce");
