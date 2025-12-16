-- CreateTable
CREATE TABLE "InteropPluginConfig" (
    "pluginName" VARCHAR(255) NOT NULL,
    "syncedBlockRanges" JSONB,
    "resyncRequestedFrom" TIMESTAMP(6),

    CONSTRAINT "InteropPluginConfig_pkey" PRIMARY KEY ("pluginName")
);
