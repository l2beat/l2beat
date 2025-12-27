-- CreateTable
CREATE TABLE "InteropPluginStatus" (
    "pluginName" VARCHAR(255) NOT NULL,
    "syncedBlockRanges" JSONB,
    "resyncRequestedFrom" TIMESTAMP(6),

    CONSTRAINT "InteropPluginStatus_pkey" PRIMARY KEY ("pluginName")
);
