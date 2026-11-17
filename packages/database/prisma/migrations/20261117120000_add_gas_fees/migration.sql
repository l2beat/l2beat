-- CreateTable
CREATE TABLE "GasFeesDaily" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "chain" VARCHAR(32) NOT NULL,
    "txCount" INTEGER NOT NULL,
    "totalFeeNative" DOUBLE PRECISION NOT NULL,
    "totalFeeUsd" DOUBLE PRECISION,
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
