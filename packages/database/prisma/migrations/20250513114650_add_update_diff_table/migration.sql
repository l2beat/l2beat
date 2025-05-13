-- CreateTable
CREATE TABLE "UpdateDiff" (
    "projectName" VARCHAR(255) NOT NULL,
    "chain" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UpdateDiff_projectName_address_type_chain_key" ON "UpdateDiff"("projectName", "address", "type", "chain");
