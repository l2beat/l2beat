-- CreateTable
CREATE TABLE "AggregatedInteropDeployedToken" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "id" VARCHAR(255) NOT NULL,
    "srcChain" VARCHAR(255) NOT NULL,
    "dstChain" VARCHAR(255) NOT NULL,
    "bridgeType" VARCHAR(255) NOT NULL DEFAULT 'unknown',
    "tokenChain" VARCHAR(255) NOT NULL,
    "tokenAddress" VARCHAR(255) NOT NULL,
    "transferTypeStats" JSONB,
    "mintedValueUsd" REAL,
    "burnedValueUsd" REAL,
    "transferCount" INTEGER NOT NULL,
    "transfersWithDurationCount" INTEGER NOT NULL DEFAULT 0,
    "totalDurationSum" INTEGER NOT NULL,
    "volume" REAL NOT NULL,
    "minTransferValueUsd" REAL,
    "maxTransferValueUsd" REAL,

    CONSTRAINT "AggregatedInteropDeployedToken_pkey" PRIMARY KEY ("timestamp","srcChain","dstChain","bridgeType","id","tokenChain","tokenAddress")
);

-- CreateIndex
CREATE INDEX "AggregatedInteropDeployedToken_timestamp_srcChain_dstChain_idx" ON "AggregatedInteropDeployedToken"("timestamp", "srcChain", "dstChain", "id", "bridgeType");
