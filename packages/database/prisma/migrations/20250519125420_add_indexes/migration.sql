-- CreateIndex
CREATE INDEX "ProjectValue_type_timestamp_idx" ON "ProjectValue"("type", "timestamp" DESC);

-- CreateIndex
CREATE INDEX "ProjectValue_type_project_timestamp_idx" ON "ProjectValue"("type", "project", "timestamp");

-- CreateIndex
CREATE INDEX "TokenValue_projectId_tokenId_timestamp_idx" ON "TokenValue"("projectId", "tokenId", "timestamp" DESC);
