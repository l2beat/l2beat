-- CreateTable
CREATE TABLE "TvsBlockTimestamp" (
    "chain" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "configurationId" CHAR(12) NOT NULL,

    CONSTRAINT "TvsBlockTimestamp_pkey" PRIMARY KEY ("chain","timestamp")
);
