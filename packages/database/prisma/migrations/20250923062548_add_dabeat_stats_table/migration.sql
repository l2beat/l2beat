-- CreateTable
CREATE TABLE "DaBeatStats" (
    "id" VARCHAR(255) NOT NULL,
    "totalStake" REAL NOT NULL,
    "thresholdStake" REAL NOT NULL,
    "numberOfValidators" INTEGER,

    CONSTRAINT "DaBeatStats_pkey" PRIMARY KEY ("id")
);
