-- DropIndex
DROP INDEX "InteropEvent_timestamp_idx";

-- CreateIndex
CREATE INDEX "InteropEvent_timestamp_plugin_chain_idx" ON "InteropEvent"("timestamp", "plugin", "chain");
