-- CreateTable
CREATE TABLE "RealTimeLiveness" (
    "configurationId" VARCHAR(12) NOT NULL,
    "txHash" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "blockNumber" INTEGER NOT NULL,

    CONSTRAINT "RealTimeLiveness_pkey" PRIMARY KEY ("configurationId","txHash")
);

-- CreateTable
CREATE TABLE "RealTimeAnomaly" (
    "start" TIMESTAMP(6) NOT NULL,
    "projectId" VARCHAR(255) NOT NULL,
    "subtype" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "end" TIMESTAMP(6),

    CONSTRAINT "RealTimeAnomaly_pkey" PRIMARY KEY ("start","projectId","subtype")
);

-- CreateIndex
CREATE INDEX "RealTimeLiveness_configurationId_timestamp_idx" ON "RealTimeLiveness"("configurationId", "timestamp");
