-- CreateTable
CREATE TABLE "TvsAmount" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "amount" DECIMAL(80,0) NOT NULL,
    "configurationId" CHAR(12) NOT NULL,
    "project" VARCHAR(255) NOT NULL,

    CONSTRAINT "TvsAmount_pkey" PRIMARY KEY ("timestamp","configurationId")
);

-- CreateIndex
CREATE INDEX "TvsAmount_project_idx" ON "TvsAmount"("project");
