-- CreateIndex
CREATE INDEX "TokenValue_projectId_timestamp_tokenId_valueForProject_valu_idx" ON "TokenValue"("projectId", "timestamp", "tokenId", "valueForProject", "valueForSummary");
