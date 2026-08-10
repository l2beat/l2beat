-- CreateIndex
CREATE INDEX "InteropTransfer_srcAbstractTokenId_timestamp_idx" ON "InteropTransfer"("srcAbstractTokenId", "timestamp" DESC);

-- CreateIndex
CREATE INDEX "InteropTransfer_dstAbstractTokenId_timestamp_idx" ON "InteropTransfer"("dstAbstractTokenId", "timestamp" DESC);
