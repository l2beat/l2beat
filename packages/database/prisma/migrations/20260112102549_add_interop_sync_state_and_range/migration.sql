-- CreateTable
CREATE TABLE "InteropPluginSyncState" (
    "pluginName" VARCHAR(255) NOT NULL,
    "chain" VARCHAR(255) NOT NULL,
    "lastError" TEXT,
    "resyncRequestedFrom" TIMESTAMP(6),

    CONSTRAINT "InteropPluginSyncState_pkey" PRIMARY KEY ("pluginName","chain")
);

-- CreateTable
CREATE TABLE "InteropPluginSyncedRange" (
    "pluginName" VARCHAR(255) NOT NULL,
    "chain" VARCHAR(255) NOT NULL,
    "fromBlock" BIGINT NOT NULL,
    "fromTimestamp" TIMESTAMP(6) NOT NULL,
    "toBlock" BIGINT NOT NULL,
    "toTimestamp" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "InteropPluginSyncedRange_pkey" PRIMARY KEY ("pluginName","chain")
);

-- CreateIndex
CREATE INDEX "InteropEvent_timestamp_plugin_chain_idx" ON "InteropEvent"("timestamp", "plugin", "chain");
