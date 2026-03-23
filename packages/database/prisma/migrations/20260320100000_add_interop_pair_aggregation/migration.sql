-- CreateTable
CREATE TABLE "AggregatedInteropPair" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "id" VARCHAR(255) NOT NULL,
    "srcChain" VARCHAR(255) NOT NULL,
    "dstChain" VARCHAR(255) NOT NULL,
    "bridgeType" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "tokenPair" VARCHAR(14) NOT NULL,
    "transferTypeStats" JSONB,
    "transferCount" INTEGER NOT NULL,
    "transfersWithDurationCount" INTEGER NOT NULL DEFAULT 0,
    "totalDurationSum" INTEGER NOT NULL,
    "volume" REAL NOT NULL,
    "minTransferValueUsd" REAL,
    "maxTransferValueUsd" REAL,

    CONSTRAINT "AggregatedInteropPair_pkey" PRIMARY KEY ("timestamp","srcChain","dstChain","bridgeType","id","tokenPair")
);

-- CreateIndex
CREATE INDEX "AggregatedInteropPair_timestamp_srcChain_dstChain_id_bridgeT_idx" ON "AggregatedInteropPair"("timestamp", "srcChain", "dstChain", "id", "bridgeType");
