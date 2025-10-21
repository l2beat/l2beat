-- CreateTable
CREATE TABLE "InteropConfig" (
    "key" VARCHAR(64) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "InteropConfig_pkey" PRIMARY KEY ("key","timestamp")
);
