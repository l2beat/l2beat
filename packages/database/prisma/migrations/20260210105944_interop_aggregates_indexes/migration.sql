-- CreateIndex
CREATE INDEX "AggregatedInteropToken_timestamp_srcChain_dstChain_id_bridg_idx" ON "AggregatedInteropToken"("timestamp", "srcChain", "dstChain", "id", "bridgeType");

-- CreateIndex
CREATE INDEX "AggregatedInteropTransfer_timestamp_srcChain_dstChain_id_br_idx" ON "AggregatedInteropTransfer"("timestamp", "srcChain", "dstChain", "id", "bridgeType");
