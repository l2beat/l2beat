-- CreateTable
CREATE TABLE "AbstractToken" (
    "id" CHAR(6) NOT NULL,
    "issuer" VARCHAR(255),
    "symbol" VARCHAR(255) NOT NULL,
    "category" VARCHAR(255) NOT NULL,
    "iconUrl" VARCHAR(255),
    "coingeckoId" VARCHAR(255),
    "coingeckoListingTimestamp" TIMESTAMP(6),
    "comment" TEXT,
    "reviewed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AbstractToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeployedToken" (
    "chain" VARCHAR(32) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "abstractTokenId" CHAR(6),
    "symbol" VARCHAR(255) NOT NULL,
    "decimals" INTEGER NOT NULL,
    "deploymentTimestamp" TIMESTAMP(6) NOT NULL,
    "comment" TEXT,

    CONSTRAINT "DeployedToken_pkey" PRIMARY KEY ("chain","address")
);

-- CreateTable
CREATE TABLE "TokenConnection" (
    "tokenFromChain" VARCHAR(32) NOT NULL,
    "tokenFromAddress" VARCHAR(255) NOT NULL,
    "tokenToChain" VARCHAR(32) NOT NULL,
    "tokenToAddress" VARCHAR(255) NOT NULL,
    "type" VARCHAR(32) NOT NULL,
    "params" JSON,
    "comment" TEXT,

    CONSTRAINT "TokenConnection_pkey" PRIMARY KEY ("tokenFromChain","tokenFromAddress","tokenToChain","tokenToAddress","type")
);

-- CreateIndex
CREATE UNIQUE INDEX "AbstractToken_issuer_symbol_key" ON "AbstractToken"("issuer", "symbol");

-- CreateIndex
CREATE INDEX "DeployedToken_abstractTokenId_idx" ON "DeployedToken"("abstractTokenId");

-- CreateIndex
CREATE INDEX "TokenConnection_tokenFromChain_tokenFromAddress_idx" ON "TokenConnection"("tokenFromChain", "tokenFromAddress");

-- CreateIndex
CREATE INDEX "TokenConnection_tokenToChain_tokenToAddress_idx" ON "TokenConnection"("tokenToChain", "tokenToAddress");

-- AddForeignKey
ALTER TABLE "DeployedToken" ADD CONSTRAINT "DeployedToken_abstractTokenId_fkey" FOREIGN KEY ("abstractTokenId") REFERENCES "AbstractToken"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenConnection" ADD CONSTRAINT "TokenConnection_tokenFromChain_tokenFromAddress_fkey" FOREIGN KEY ("tokenFromChain", "tokenFromAddress") REFERENCES "DeployedToken"("chain", "address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenConnection" ADD CONSTRAINT "TokenConnection_tokenToChain_tokenToAddress_fkey" FOREIGN KEY ("tokenToChain", "tokenToAddress") REFERENCES "DeployedToken"("chain", "address") ON DELETE RESTRICT ON UPDATE CASCADE;
