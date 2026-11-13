-- CreateTable
CREATE TABLE "LiveActivityBlock" (
    "projectId" VARCHAR(255) NOT NULL,
    "number" INTEGER NOT NULL,
    "hash" VARCHAR(66) NOT NULL,
    "parentHash" VARCHAR(66) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "count" INTEGER NOT NULL,
    "uopsCount" INTEGER,
    "gasUsed" BIGINT NOT NULL,

    CONSTRAINT "LiveActivityBlock_pkey" PRIMARY KEY ("projectId","number")
);

-- CreateIndex
CREATE INDEX "LiveActivityBlock_timestamp_idx" ON "LiveActivityBlock"("timestamp");

