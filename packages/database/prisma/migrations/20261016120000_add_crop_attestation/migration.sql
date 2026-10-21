-- CreateTable
CREATE TABLE "CropAttestation" (
    "network" VARCHAR(255) NOT NULL,
    "chainId" INTEGER NOT NULL,
    "eas" VARCHAR(42) NOT NULL,
    "explorer" VARCHAR(255) NOT NULL,
    "schemaUid" VARCHAR(66) NOT NULL,
    "schema" VARCHAR(255) NOT NULL,
    "attester" VARCHAR(42) NOT NULL,
    "uid" VARCHAR(66) NOT NULL,
    "revision" INTEGER NOT NULL,
    "reviewedAt" TIMESTAMP(6) NOT NULL,
    "projectIds" VARCHAR(255)[],
    "txHash" VARCHAR(66) NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "CropAttestation_pkey" PRIMARY KEY ("uid")
);
