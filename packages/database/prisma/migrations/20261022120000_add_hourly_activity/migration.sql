-- CreateTable
CREATE TABLE "HourlyActivity" (
    "projectId" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "count" INTEGER NOT NULL,
    "uopsCount" INTEGER,
    "peakCount" INTEGER NOT NULL,
    "peakUopsCount" INTEGER,

    CONSTRAINT "HourlyActivity_pkey" PRIMARY KEY ("projectId","timestamp")
);
