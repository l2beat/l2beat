-- CreateTable
CREATE TABLE "DefiTvl" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "sourceTimestamp" TIMESTAMP(6) NOT NULL,
    "configurationId" CHAR(12) NOT NULL,
    "projectId" VARCHAR(255) NOT NULL,
    "chain" VARCHAR(255) NOT NULL,
    "valueUsd" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DefiTvl_pkey" PRIMARY KEY ("timestamp", "configurationId", "chain")
);

-- CreateIndex
CREATE INDEX "DefiTvl_configurationId_idx" ON "DefiTvl"("configurationId");

-- CreateIndex
CREATE INDEX "DefiTvl_projectId_timestamp_idx" ON "DefiTvl"("projectId", "timestamp" DESC);
