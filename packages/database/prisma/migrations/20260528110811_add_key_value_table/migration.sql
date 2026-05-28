-- CreateTable
CREATE TABLE "KeyValue" (
    "key" VARCHAR(255) NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    "updatedBy" VARCHAR(255) NOT NULL,

    CONSTRAINT "KeyValue_pkey" PRIMARY KEY ("key")
);
