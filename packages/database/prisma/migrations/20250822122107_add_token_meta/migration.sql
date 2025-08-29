-- CreateTable
CREATE TABLE "TokenMetadata" (
    "tokenId" VARCHAR(255) NOT NULL,
    "projectId" VARCHAR(255) NOT NULL,
    "source" VARCHAR(255) NOT NULL,
    "category" VARCHAR(255) NOT NULL,
    "isAssociated" BOOLEAN NOT NULL,

    CONSTRAINT "TokenMetadata_pkey" PRIMARY KEY ("tokenId")
);

-- CreateIndex
CREATE INDEX "TokenMetadata_projectId_idx" ON "TokenMetadata"("projectId");
