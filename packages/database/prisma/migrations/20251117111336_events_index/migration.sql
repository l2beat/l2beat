-- DropIndex
DROP INDEX "InteropEvent_type_idx";

-- CreateIndex
CREATE INDEX "InteropEvent_type_matched_unsupported_timestamp_idx" ON "InteropEvent"("type", "matched", "unsupported", "timestamp");
