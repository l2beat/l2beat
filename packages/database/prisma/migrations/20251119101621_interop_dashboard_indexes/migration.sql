-- CreateIndex
CREATE INDEX "InteropMessage_type_app_duration_idx" ON "InteropMessage"("type", "app", "duration");

-- CreateIndex
CREATE INDEX "InteropMessage_type_srcChain_dstChain_duration_idx" ON "InteropMessage"("type", "srcChain", "dstChain", "duration");

-- CreateIndex
CREATE INDEX "InteropTransfer_isProcessed_srcValueUsd_dstValueUsd_idx" ON "InteropTransfer"("isProcessed", "srcValueUsd", "dstValueUsd");

-- CreateIndex
CREATE INDEX "InteropTransfer_type_duration_srcValueUsd_dstValueUsd_idx" ON "InteropTransfer"("type", "duration", "srcValueUsd", "dstValueUsd");
