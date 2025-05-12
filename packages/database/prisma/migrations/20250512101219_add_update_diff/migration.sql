-- CreateTable
CREATE TABLE "UpdateDiff" (
    "address" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UpdateDiff_address_key" ON "UpdateDiff"("address");
