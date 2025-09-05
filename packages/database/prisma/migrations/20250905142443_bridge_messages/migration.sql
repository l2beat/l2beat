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
    "logIndex" INTEGER NOT NULL,
    "args" JSONB NOT NULL,

    CONSTRAINT "BridgeEvent_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "BridgeMessage" (
    "messageId" VARCHAR(40) NOT NULL,
    "type" VARCHAR(64) NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(6) NOT NULL,
    "srcTime" TIMESTAMP(6) NOT NULL,
    "srcChain" VARCHAR(32) NOT NULL,
    "srcTxHash" VARCHAR(66) NOT NULL,
    "srcLogIndex" INTEGER NOT NULL,
    "dstTime" TIMESTAMP(6) NOT NULL,
    "dstChain" VARCHAR(32) NOT NULL,
    "dstTxHash" VARCHAR(66) NOT NULL,
    "dstLogIndex" INTEGER NOT NULL,

    CONSTRAINT "BridgeMessage_pkey" PRIMARY KEY ("messageId")
);
