-- CreateTable
CREATE TABLE "AggregatedInteropPair" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "id" VARCHAR(255) NOT NULL,
    "srcChain" VARCHAR(255) NOT NULL,
    "dstChain" VARCHAR(255) NOT NULL,
    "bridgeType" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "tokenA" VARCHAR(8) NOT NULL,
    "tokenB" VARCHAR(8) NOT NULL,
    "transferTypeStats" JSONB,
    "transferCount" INTEGER NOT NULL,
    "transfersWithDurationCount" INTEGER NOT NULL DEFAULT 0,
    "totalDurationSum" INTEGER NOT NULL,
    "volume" REAL NOT NULL,
    "minTransferValueUsd" REAL,
    "maxTransferValueUsd" REAL,

    CONSTRAINT "AggregatedInteropPair_pkey" PRIMARY KEY ("timestamp","srcChain","dstChain","bridgeType","id","tokenA","tokenB")
);

-- CreateIndex
CREATE INDEX "AggregatedInteropPair_timestamp_srcChain_dstChain_id_bridge_idx" ON "AggregatedInteropPair"("timestamp", "srcChain", "dstChain", "id", "bridgeType");
