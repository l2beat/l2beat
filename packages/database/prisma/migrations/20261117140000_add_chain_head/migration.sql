-- CreateTable
CREATE TABLE "ChainHead" (
    "chain" VARCHAR(64) NOT NULL,
    "number" INTEGER NOT NULL,
    "confirmedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "ChainHead_pkey" PRIMARY KEY ("chain")
);
