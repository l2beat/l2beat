-- CreateTable
CREATE TABLE "InteropAggregateStatus" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "status" VARCHAR(16) NOT NULL,
    "promotedBy" VARCHAR(255),
    "reasons" TEXT,
    "checkedAt" TIMESTAMP(6) NOT NULL,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "InteropAggregateStatus_pkey" PRIMARY KEY ("timestamp")
);
