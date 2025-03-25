-- CreateTable
CREATE TABLE "TvsAmount" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "amount" DECIMAL(80,0) NOT NULL,
    "configurationId" CHAR(12) NOT NULL,
    "project" VARCHAR(255) NOT NULL,

    CONSTRAINT "TvsAmount_pkey" PRIMARY KEY ("timestamp","configurationId")
);

-- CreateTable
CREATE TABLE "TvsBlockTimestamp" (
    "chain" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "configurationId" CHAR(12) NOT NULL,

    CONSTRAINT "TvsBlockTimestamp_pkey" PRIMARY KEY ("chain","timestamp")
);

-- CreateIndex
CREATE INDEX "TvsAmount_project_idx" ON "TvsAmount"("project");
