-- CreateTable
CREATE TABLE "EthereumStakingDaily" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "slot" INTEGER NOT NULL,
    "totalBalance" DECIMAL(80,0) NOT NULL,
    "pendingDeposits" DECIMAL(80,0),
    "withdrawals" DECIMAL(80,0) NOT NULL,
    "deposits" DECIMAL(80,0) NOT NULL,
    "executionRewards" DECIMAL(80,0) NOT NULL,
    "blockCount" INTEGER NOT NULL,

    CONSTRAINT "EthereumStakingDaily_pkey" PRIMARY KEY ("timestamp")
);
