CREATE TABLE "TokenDbHistoryEntry" (
    "id" BIGSERIAL NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "source" VARCHAR(32) NOT NULL,
    "userEmail" VARCHAR(255),
    "commandType" VARCHAR(64) NOT NULL,
    "command" JSONB NOT NULL,

    CONSTRAINT "TokenDbHistoryEntry_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TokenDbHistoryEntry_timestamp_idx" ON "TokenDbHistoryEntry"("timestamp");

CREATE INDEX "TokenDbHistoryEntry_commandType_timestamp_idx" ON "TokenDbHistoryEntry"("commandType", "timestamp");
