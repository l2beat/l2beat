-- CreateTable
CREATE TABLE "GasFeesMempoolDay" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "status" VARCHAR(16) NOT NULL,
    "duneLandedCount" INTEGER NOT NULL,
    "flashbotsLandedCount" INTEGER,
    "keptCount" INTEGER NOT NULL,

    CONSTRAINT "GasFeesMempoolDay_pkey" PRIMARY KEY ("timestamp")
);

-- CreateTable
CREATE TABLE "GasFeesTipLevelWait" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "tipFromWei" INTEGER NOT NULL,
    "tipToWei" INTEGER NOT NULL,
    "waitFromMs" INTEGER NOT NULL,
    "waitToMs" INTEGER,
    "txCount" INTEGER NOT NULL,
    "nextBlockCount" INTEGER NOT NULL,
    "tipSumGwei" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "GasFeesTipLevelWait_pkey" PRIMARY KEY ("timestamp","tipFromWei","waitFromMs")
);

-- CreateTable
CREATE TABLE "GasFeesTierWait" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "tier" VARCHAR(16) NOT NULL,
    "waitFromMs" INTEGER NOT NULL,
    "waitToMs" INTEGER,
    "txCount" INTEGER NOT NULL,
    "nextBlockCount" INTEGER NOT NULL,
    "within2BlocksCount" INTEGER NOT NULL,
    "within1MinuteCount" INTEGER NOT NULL,

    CONSTRAINT "GasFeesTierWait_pkey" PRIMARY KEY ("timestamp","tier","waitFromMs")
);

-- CreateTable
CREATE TABLE "GasFeesTipPayersDaily" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "ethUsd" DOUBLE PRECISION NOT NULL,
    "fastTipGwei" DOUBLE PRECISION NOT NULL,
    "lowTxCount" INTEGER NOT NULL,
    "lowTipEth" DOUBLE PRECISION NOT NULL,
    "lowTipUsd" DOUBLE PRECISION NOT NULL,
    "middleTxCount" INTEGER NOT NULL,
    "middleTipEth" DOUBLE PRECISION NOT NULL,
    "middleTipUsd" DOUBLE PRECISION NOT NULL,
    "highTxCount" INTEGER NOT NULL,
    "highTipEth" DOUBLE PRECISION NOT NULL,
    "highTipUsd" DOUBLE PRECISION NOT NULL,
    "roundTipTxCount" INTEGER NOT NULL,
    "atFastTipEth" DOUBLE PRECISION NOT NULL,
    "atFastTipUsd" DOUBLE PRECISION NOT NULL,
    "nonOrdinaryTxCount" INTEGER NOT NULL,
    "nonOrdinaryTipEth" DOUBLE PRECISION NOT NULL,
    "nonOrdinaryTipUsd" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "GasFeesTipPayersDaily_pkey" PRIMARY KEY ("timestamp")
);

