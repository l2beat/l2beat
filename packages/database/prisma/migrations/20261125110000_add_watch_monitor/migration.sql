-- CreateTable
CREATE TABLE "WatchMonitor" (
    "name" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "valuesJsonBlob" JSONB NOT NULL,

    CONSTRAINT "WatchMonitor_pkey" PRIMARY KEY ("name")
);
