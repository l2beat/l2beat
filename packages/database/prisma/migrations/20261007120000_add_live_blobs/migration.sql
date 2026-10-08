-- CreateTable
CREATE TABLE "LiveBlock" (
    "slot" INTEGER NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "hash" VARCHAR(66) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "blobCount" INTEGER NOT NULL,

    CONSTRAINT "LiveBlock_pkey" PRIMARY KEY ("slot")
);

-- CreateTable
CREATE TABLE "LiveBlobBatch" (
    "slot" INTEGER NOT NULL,
    "txIndex" INTEGER NOT NULL,
    "txHash" VARCHAR(66) NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "from" VARCHAR(255) NOT NULL,
    "to" VARCHAR(255) NOT NULL,
    "blobs" INTEGER NOT NULL,
    "topics" VARCHAR(66)[],
    "projectId" VARCHAR(255),

    CONSTRAINT "LiveBlobBatch_pkey" PRIMARY KEY ("slot","txIndex")
);

-- CreateIndex
CREATE INDEX "LiveBlock_blockNumber_idx" ON "LiveBlock"("blockNumber");

-- CreateIndex
CREATE INDEX "LiveBlobBatch_blockNumber_idx" ON "LiveBlobBatch"("blockNumber");

-- CreateIndex
CREATE INDEX "LiveBlobBatch_projectId_slot_idx" ON "LiveBlobBatch"("projectId", "slot");

