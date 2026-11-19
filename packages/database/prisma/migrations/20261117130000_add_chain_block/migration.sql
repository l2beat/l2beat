-- CreateTable
CREATE TABLE "ChainBlock" (
    "chain" VARCHAR(64) NOT NULL,
    "number" INTEGER NOT NULL,
    "hash" VARCHAR(66) NOT NULL,
    "parentHash" VARCHAR(66) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "logsBloom" TEXT,

    CONSTRAINT "ChainBlock_pkey" PRIMARY KEY ("chain","number")
);

-- CreateIndex
CREATE INDEX "ChainBlock_timestamp_idx" ON "ChainBlock"("timestamp");
