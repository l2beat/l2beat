-- CreateTable
CREATE TABLE "UpdateMessage" (
    "projectName" VARCHAR(255) NOT NULL,
    "chain" VARCHAR(255) NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "UpdateMessage_pkey" PRIMARY KEY ("projectName","chain","blockNumber")
);
