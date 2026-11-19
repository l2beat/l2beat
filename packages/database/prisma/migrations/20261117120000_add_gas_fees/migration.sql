-- CreateTable
CREATE TABLE "GasFeesDaily" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "chain" VARCHAR(32) NOT NULL,
    "txCount" INTEGER NOT NULL,
    "totalFeeNative" DOUBLE PRECISION NOT NULL,
    "totalFeeUsd" DOUBLE PRECISION NOT NULL,
    "l1FeeNative" DOUBLE PRECISION NOT NULL,
    "blobFeeNative" DOUBLE PRECISION NOT NULL,
    "baseFeeNative" DOUBLE PRECISION,
    "gasUsed" DOUBLE PRECISION NOT NULL,
    "medianFeeUsd" DOUBLE PRECISION,

    CONSTRAINT "GasFeesDaily_pkey" PRIMARY KEY ("chain","timestamp")
);

-- CreateTable
CREATE TABLE "GasFeesTipHourly" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "slowTipGwei" DOUBLE PRECISION NOT NULL,
    "mediumTipGwei" DOUBLE PRECISION NOT NULL,
    "fastTipGwei" DOUBLE PRECISION NOT NULL,
    "ethUsd" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "GasFeesTipHourly_pkey" PRIMARY KEY ("timestamp")
);

-- CreateTable
CREATE TABLE "GasFeesLiveTips" (
    "blockNumber" INTEGER NOT NULL,
    "slowTipGwei" DOUBLE PRECISION NOT NULL,
    "mediumTipGwei" DOUBLE PRECISION NOT NULL,
    "fastTipGwei" DOUBLE PRECISION NOT NULL,
    "ethUsd" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "GasFeesLiveTips_pkey" PRIMARY KEY ("blockNumber")
);

-- CreateTable
CREATE TABLE "GasFeesWalletTip" (
    "wallet" VARCHAR(32) NOT NULL,
    "option" VARCHAR(32) NOT NULL,
    "tier" VARCHAR(16) NOT NULL,
    "tipGwei" DOUBLE PRECISION NOT NULL,
    "readAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "GasFeesWalletTip_pkey" PRIMARY KEY ("wallet","option")
);

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
    "tipFromWei" BIGINT NOT NULL,
    "tipToWei" BIGINT NOT NULL,
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
    "within5BlocksCount" INTEGER NOT NULL,

    CONSTRAINT "GasFeesTierWait_pkey" PRIMARY KEY ("timestamp","tier","waitFromMs")
);

-- CreateTable
CREATE TABLE "GasFeesTipPayersDaily" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "status" VARCHAR(16) NOT NULL,
    "ethUsd" DOUBLE PRECISION,
    "fastTipGwei" DOUBLE PRECISION,
    "lowTxCount" INTEGER,
    "lowTipEth" DOUBLE PRECISION,
    "middleTxCount" INTEGER,
    "middleTipEth" DOUBLE PRECISION,
    "highTxCount" INTEGER,
    "highTipEth" DOUBLE PRECISION,
    "roundTipTxCount" INTEGER,
    "atFastTipEth" DOUBLE PRECISION,
    "nonOrdinaryTxCount" INTEGER,
    "nonOrdinaryTipEth" DOUBLE PRECISION,

    CONSTRAINT "GasFeesTipPayersDaily_pkey" PRIMARY KEY ("timestamp")
);

