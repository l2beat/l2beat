-- CreateTable
CREATE TABLE "DataAvailability" (
    "projectId" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "totalSize" INTEGER NOT NULL,

    CONSTRAINT "DataAvailability_pkey" PRIMARY KEY ("projectId","timestamp")
);
