-- CreateTable
CREATE TABLE "Chain" (
    "name" VARCHAR(255) NOT NULL,
    "chainId" INTEGER NOT NULL,
    "aliases" JSON,
    "apis" JSON,

    CONSTRAINT "Chain_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chain_chainId_key" ON "Chain"("chainId");
