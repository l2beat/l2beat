-- CreateTable
CREATE TABLE "InteropPluginSyncedRange" (
    "pluginName" VARCHAR(255) NOT NULL,
    "chain" VARCHAR(255) NOT NULL,
    "fromBlock" INTEGER NOT NULL,
    "fromTimestamp" TIMESTAMP(6) NOT NULL,
    "toBlock" INTEGER NOT NULL,
    "toTimestamp" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "InteropPluginSyncedRange_pkey" PRIMARY KEY ("pluginName","chain")
);
