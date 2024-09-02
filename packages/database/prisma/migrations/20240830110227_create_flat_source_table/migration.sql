-- CreateTable
CREATE TABLE "FlatSources" (
    "projectName" VARCHAR(255) NOT NULL,
    "chainId" INTEGER NOT NULL,
    "blockNumber" INTEGER NOT NULL,
    "contentHash" VARCHAR(255) NOT NULL,
    "flat" JSONB NOT NULL,

    CONSTRAINT "FlatSources_pkey" PRIMARY KEY ("projectName","chainId")
);
