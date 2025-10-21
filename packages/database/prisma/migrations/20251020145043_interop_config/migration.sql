-- CreateTable
CREATE TABLE "InteropConfig" (
    "key" VARCHAR(64) NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "InteropConfig_pkey" PRIMARY KEY ("key")
);
