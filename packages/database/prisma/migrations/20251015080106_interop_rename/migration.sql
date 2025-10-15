/*
  Warnings:

  - You are about to drop the `BridgeEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BridgeMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BridgeTransfer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "BridgeEvent";

-- DropTable
DROP TABLE "BridgeMessage";

-- DropTable
DROP TABLE "BridgeTransfer";

-- CreateTable
CREATE TABLE "InteropEvent" (
    "plugin" VARCHAR(64) NOT NULL,
    "eventId" VARCHAR(40) NOT NULL,
    "type" VARCHAR(64) NOT NULL,
    "expiresAt" TIMESTAMP(6) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "chain" VARCHAR(32) NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "txHash" VARCHAR(66) NOT NULL,
    "blockHash" VARCHAR(66) NOT NULL,
    "value" VARCHAR(66),
    "txTo" VARCHAR(66),
    "logIndex" INTEGER,
    "args" JSONB NOT NULL,
    "matched" BOOLEAN NOT NULL,
    "unsupported" BOOLEAN NOT NULL,

    CONSTRAINT "InteropEvent_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "InteropMessage" (
    "plugin" VARCHAR(64) NOT NULL,
    "messageId" VARCHAR(40) NOT NULL,
    "type" VARCHAR(64) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "app" VARCHAR(64) NOT NULL,
    "duration" INTEGER,
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

    CONSTRAINT "InteropMessage_pkey" PRIMARY KEY ("messageId")
);

-- CreateTable
CREATE TABLE "InteropTransfer" (
    "plugin" VARCHAR(64) NOT NULL,
    "transferId" VARCHAR(40) NOT NULL,
    "type" VARCHAR(64) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "duration" INTEGER,
    "srcTime" TIMESTAMP(6),
    "srcChain" VARCHAR(32),
    "srcTxHash" VARCHAR(66),
    "srcLogIndex" INTEGER,
    "srcEventId" VARCHAR(40),
    "srcTokenAddress" VARCHAR(66),
    "srcRawAmount" DECIMAL(80,0),
    "srcAbstractTokenId" VARCHAR(66),
    "srcAmount" REAL,
    "srcPrice" REAL,
    "srcValueUsd" REAL,
    "dstTime" TIMESTAMP(6),
    "dstChain" VARCHAR(32),
    "dstTxHash" VARCHAR(66),
    "dstLogIndex" INTEGER,
    "dstEventId" VARCHAR(40),
    "dstTokenAddress" VARCHAR(66),
    "dstRawAmount" DECIMAL(80,0),
    "dstAbstractTokenId" VARCHAR(66),
    "dstAmount" REAL,
    "dstPrice" REAL,
    "dstValueUsd" REAL,
    "isProcessed" BOOLEAN NOT NULL,

    CONSTRAINT "InteropTransfer_pkey" PRIMARY KEY ("transferId")
);

-- CreateIndex
CREATE INDEX "InteropEvent_type_idx" ON "InteropEvent"("type");

-- CreateIndex
CREATE INDEX "InteropMessage_type_idx" ON "InteropMessage"("type");

-- CreateIndex
CREATE INDEX "InteropTransfer_type_idx" ON "InteropTransfer"("type");

-- CreateIndex
CREATE INDEX "InteropTransfer_isProcessed_idx" ON "InteropTransfer"("isProcessed");
