-- CreateTable
CREATE TABLE "CropAttestation" (
    "chainId" INTEGER NOT NULL,
    "attester" VARCHAR(42) NOT NULL,
    "uid" VARCHAR(66) NOT NULL,
    "revision" INTEGER NOT NULL,
    "reviewedAt" TIMESTAMP(6) NOT NULL,
    "projectIds" VARCHAR(255)[],
    "txHash" VARCHAR(66) NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "CropAttestation_pkey" PRIMARY KEY ("chainId","attester")
);
