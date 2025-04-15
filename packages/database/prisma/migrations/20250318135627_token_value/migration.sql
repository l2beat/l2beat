-- CreateTable
CREATE TABLE "TokenValue" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "configurationId" CHAR(12) NOT NULL,
    "project" VARCHAR(255) NOT NULL,
    "amount" REAL NOT NULL,
    "value" REAL NOT NULL,
    "valueForProject" REAL NOT NULL,
    "valueForSummary" REAL NOT NULL,

    CONSTRAINT "TokenValue_pkey" PRIMARY KEY ("timestamp","configurationId")
);

-- CreateIndex
CREATE INDEX "TokenValue_project_idx" ON "TokenValue"("project");
