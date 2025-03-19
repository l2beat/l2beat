-- CreateTable
CREATE TABLE "ProjectValue" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "project" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "value" REAL NOT NULL,
    "canonical" REAL NOT NULL,
    "external" REAL NOT NULL,
    "native" REAL NOT NULL,
    "ether" REAL NOT NULL,
    "stablecoin" REAL NOT NULL,
    "other" REAL NOT NULL,
    "associated" REAL NOT NULL,

    CONSTRAINT "ProjectValue_pkey" PRIMARY KEY ("timestamp","project","type")
);
