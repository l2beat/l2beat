-- CreateTable
CREATE TABLE "WatchMonitor" (
    "name" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6),
    "valuesJsonBlob" JSONB,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "configHash" VARCHAR(255),
    "pendingNotificationsJsonBlob" JSONB,
    "lastAttemptAt" TIMESTAMP(6),
    "lastAttemptId" VARCHAR(64),
    "lastAttemptConfigHash" VARCHAR(255),
    "lastError" TEXT,

    CONSTRAINT "WatchMonitor_pkey" PRIMARY KEY ("name")
);
