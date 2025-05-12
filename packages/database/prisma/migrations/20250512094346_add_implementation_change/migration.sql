-- CreateTable
CREATE TABLE "ImplementationChange" (
    "address" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ImplementationChange_address_key" ON "ImplementationChange"("address");
