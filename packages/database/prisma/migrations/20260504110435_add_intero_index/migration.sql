-- CreateIndex
CREATE INDEX "InteropTransfer_plugin_srcChain_dstChain_timestamp_transfer_idx" ON "InteropTransfer"("plugin", "srcChain", "dstChain", "timestamp" DESC, "transferId" DESC);
