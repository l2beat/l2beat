-- CreateIndex
CREATE INDEX "AggregatedInteropDeployedToken_timestamp_tokenChain_tokenAd_idx" ON "AggregatedInteropDeployedToken"("timestamp", "tokenChain", "tokenAddress");
