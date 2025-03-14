-- CreateTable
CREATE TABLE "TvsPrice" (
    "priceId" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "priceUsd" REAL NOT NULL,

    CONSTRAINT "TvsPrice_pkey" PRIMARY KEY ("priceId","timestamp")
);
