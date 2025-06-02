-- CreateTable
CREATE TABLE "AnomalyStats" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "projectId" VARCHAR(255) NOT NULL,
    "subtype" VARCHAR(255) NOT NULL,
    "mean" REAL NOT NULL,
    "stdDev" REAL NOT NULL,

    CONSTRAINT "AnomalyStats_pkey" PRIMARY KEY ("timestamp","projectId","subtype")
);
