-- CreateTable
CREATE TABLE "WatchMonitor" (
    "name" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6),
    "valuesJsonBlob" JSONB,
    "notifiedValuesJsonBlob" JSONB,
    "lastAttemptAt" TIMESTAMP(6),
    "lastError" TEXT,

    CONSTRAINT "WatchMonitor_pkey" PRIMARY KEY ("name")
);
