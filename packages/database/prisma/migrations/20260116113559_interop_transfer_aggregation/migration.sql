-- CreateTable
CREATE TABLE "AggregatedInteropTransfer" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "id" VARCHAR(255) NOT NULL,
    "srcChain" VARCHAR(255) NOT NULL,
    "dstChain" VARCHAR(255) NOT NULL,
    "tokensByVolume" JSONB NOT NULL,
    "transferCount" INTEGER NOT NULL,
    "totalDurationSum" INTEGER NOT NULL,
    "srcValueUsd" REAL,
    "dstValueUsd" REAL,

    CONSTRAINT "AggregatedInteropTransfer_pkey" PRIMARY KEY ("timestamp","srcChain","dstChain","id")
);
