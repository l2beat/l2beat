-- CreateTable
CREATE TABLE "Blob" (
    "id" SERIAL NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "daLayer" INTEGER NOT NULL,
    "from" VARCHAR(255) NOT NULL,
    "to" VARCHAR(255),
    "topics" TEXT,
    "size" BIGINT,

    CONSTRAINT "Blob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Blob_blockNumber_idx" ON "Blob"("blockNumber");
