-- CreateTable
CREATE TABLE "UpdateDiff" (
    "projectName" VARCHAR(255) NOT NULL,
    "chainId" INTEGER NOT NULL DEFAULT 1,
    "address" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UpdateDiff_projectName_address_type_chainId_key" ON "UpdateDiff"("projectName", "address", "type", "chainId");
