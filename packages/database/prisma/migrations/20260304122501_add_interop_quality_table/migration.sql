-- CreateTable
CREATE TABLE "InteropAggregationQuality" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "autoPromoted" BOOLEAN NOT NULL,
    "isPromoted" BOOLEAN NOT NULL DEFAULT false,
    "promotionRequired" BOOLEAN NOT NULL,
    "reasons" TEXT NOT NULL,
    "checkedGroups" INTEGER NOT NULL,
    "failingGroups" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InteropAggregationQuality_pkey" PRIMARY KEY ("timestamp")
);

-- CreateIndex
CREATE INDEX "InteropAggregationQuality_createdAt_idx" ON "InteropAggregationQuality"("createdAt");

-- CreateIndex
CREATE INDEX "InteropAggregationQuality_isPromoted_timestamp_idx" ON "InteropAggregationQuality"("isPromoted", "timestamp" DESC);
