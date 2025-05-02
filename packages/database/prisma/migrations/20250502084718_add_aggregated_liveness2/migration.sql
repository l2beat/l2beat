-- CreateTable
CREATE TABLE "AggregatedLiveness2" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "projectId" VARCHAR(255) NOT NULL,
    "subtype" VARCHAR(255) NOT NULL,
    "min" INTEGER NOT NULL,
    "avg" INTEGER NOT NULL,
    "max" INTEGER NOT NULL,

    CONSTRAINT "AggregatedLiveness2_pkey" PRIMARY KEY ("projectId","subtype","timestamp")
);

-- CreateIndex
CREATE INDEX "AggregatedLiveness2_timestamp_idx" ON "AggregatedLiveness2"("timestamp");

-- CreateIndex
CREATE INDEX "AggregatedLiveness2_projectId_subtype_timestamp_idx" ON "AggregatedLiveness2"("projectId", "subtype", "timestamp");
