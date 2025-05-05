-- CreateTable
CREATE TABLE "AggregatedLiveness2" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "projectId" VARCHAR(255) NOT NULL,
    "subtype" VARCHAR(255) NOT NULL,
    "min" INTEGER NOT NULL,
    "avg" INTEGER NOT NULL,
    "max" INTEGER NOT NULL,

    CONSTRAINT "AggregatedLiveness2_pkey" PRIMARY KEY ("timestamp","projectId","subtype")
);
