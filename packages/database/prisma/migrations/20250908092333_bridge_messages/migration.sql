-- CreateTable
CREATE TABLE "BridgeEvent" (
    "eventId" VARCHAR(40) NOT NULL,
    "type" VARCHAR(64) NOT NULL,
    "expiresAt" TIMESTAMP(6) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "chain" VARCHAR(32) NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "blockHash" VARCHAR(66) NOT NULL,
    "txHash" VARCHAR(66) NOT NULL,
    "txTo" VARCHAR(42),
    "matched" BOOLEAN NOT NULL,
    "grouped" BOOLEAN NOT NULL,
    "logIndex" INTEGER NOT NULL,
    "args" JSONB NOT NULL,

    CONSTRAINT "BridgeEvent_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "BridgeMessage" (
    "messageId" VARCHAR(40) NOT NULL,
    "type" VARCHAR(64) NOT NULL,
    "duration" INTEGER,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "srcTime" TIMESTAMP(6),
    "srcChain" VARCHAR(32),
    "srcTxHash" VARCHAR(66),
    "srcLogIndex" INTEGER,
    "srcEventId" VARCHAR(40),
    "dstTime" TIMESTAMP(6),
    "dstChain" VARCHAR(32),
    "dstTxHash" VARCHAR(66),
    "dstLogIndex" INTEGER,
    "dstEventId" VARCHAR(40),

    CONSTRAINT "BridgeMessage_pkey" PRIMARY KEY ("messageId")
);

-- CreateIndex
CREATE INDEX "BridgeEvent_type_idx" ON "BridgeEvent"("type");

-- CreateIndex
CREATE INDEX "BridgeMessage_type_idx" ON "BridgeMessage"("type");
