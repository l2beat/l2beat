-- CreateTable
CREATE TABLE "EthereumStakingDaily" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "slot" INTEGER NOT NULL,
    "totalBalance" DECIMAL(80,0) NOT NULL,
    "activeBalance" DECIMAL(80,0) NOT NULL,
    "pendingDeposits" DECIMAL(80,0),
    "withdrawals" DECIMAL(80,0) NOT NULL,
    "deposits" DECIMAL(80,0) NOT NULL,
    "builderPayments" DECIMAL(80,0) NOT NULL,
    "priorityFees" DECIMAL(80,0) NOT NULL,
    "directTransfers" DECIMAL(80,0) NOT NULL,
    "blockCount" INTEGER NOT NULL,
    "builderBlockCount" INTEGER NOT NULL,

    CONSTRAINT "EthereumStakingDaily_pkey" PRIMARY KEY ("timestamp")
);
