-- CreateTable
CREATE TABLE "BridgeTransfer" (
    "messageId" VARCHAR(40) NOT NULL,
    "type" VARCHAR(64) NOT NULL,
    "duration" INTEGER,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "srcTime" TIMESTAMP(6),
    "srcChain" VARCHAR(32),
    "srcTxHash" VARCHAR(66),
    "srcLogIndex" INTEGER,
    "srcEventId" VARCHAR(40),
    "srcTokenAddress" VARCHAR(42),
    "srcRawAmount" DECIMAL(80,0),
    "srcSymbol" VARCHAR(10),
    "srcAmount" REAL,
    "srcPrice" REAL,
    "srcValueUsd" REAL,
    "dstTime" TIMESTAMP(6),
    "dstChain" VARCHAR(32),
    "dstTxHash" VARCHAR(66),
    "dstLogIndex" INTEGER,
    "dstEventId" VARCHAR(40),
    "dstTokenAddress" VARCHAR(42),
    "dstRawAmount" DECIMAL(80,0),
    "dstSymbol" VARCHAR(10),
    "dstAmount" REAL,
    "dstPrice" REAL,
    "dstValueUsd" REAL,

    CONSTRAINT "BridgeTransfer_pkey" PRIMARY KEY ("messageId")
);

-- CreateIndex
CREATE INDEX "BridgeTransfer_type_idx" ON "BridgeTransfer"("type");
