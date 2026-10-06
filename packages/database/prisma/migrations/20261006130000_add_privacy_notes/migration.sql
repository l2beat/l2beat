-- CreateTable
CREATE TABLE "PrivacyNote" (
    "configurationId" CHAR(12) NOT NULL,
    "projectId" VARCHAR(255) NOT NULL,
    "noteId" BIGINT NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "txHash" VARCHAR(66) NOT NULL,
    "amount" DECIMAL(80,0) NOT NULL,
    "expiresAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "PrivacyNote_pkey" PRIMARY KEY ("configurationId","noteId")
);

-- CreateTable
CREATE TABLE "PrivacyNoteStatusChange" (
    "configurationId" CHAR(12) NOT NULL,
    "projectId" VARCHAR(255) NOT NULL,
    "noteId" BIGINT NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "txHash" VARCHAR(66) NOT NULL,
    "logIndex" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "PrivacyNoteStatusChange_pkey" PRIMARY KEY ("configurationId","txHash","logIndex")
);

-- CreateIndex
CREATE INDEX "PrivacyNote_projectId_timestamp_idx" ON "PrivacyNote"("projectId", "timestamp");

-- CreateIndex
CREATE INDEX "PrivacyNote_configurationId_timestamp_idx" ON "PrivacyNote"("configurationId", "timestamp");

-- CreateIndex
CREATE INDEX "PrivacyNoteStatusChange_projectId_timestamp_idx" ON "PrivacyNoteStatusChange"("projectId", "timestamp");

-- CreateIndex
CREATE INDEX "PrivacyNoteStatusChange_configurationId_timestamp_idx" ON "PrivacyNoteStatusChange"("configurationId", "timestamp");
