-- CreateTable
CREATE TABLE "Da" (
    "project" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "totalSize" INTEGER NOT NULL,

    CONSTRAINT "Da_pkey" PRIMARY KEY ("project","timestamp")
);
