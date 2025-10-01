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

    CONSTRAINT "AbstractToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeployedToken" (
    "id" SERIAL NOT NULL,
    "chain" VARCHAR(32) NOT NULL,
    "address" VARCHAR(32) NOT NULL,
    "abstractTokenId" CHAR(6),
    "symbol" VARCHAR(255) NOT NULL,
    "decimals" INTEGER NOT NULL,
    "deploymentTimestamp" TIMESTAMP(6) NOT NULL,
    "comment" TEXT,

    CONSTRAINT "DeployedToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenConnection" (
    "tokenFromId" INTEGER NOT NULL,
    "tokenToId" INTEGER NOT NULL,
    "type" VARCHAR(32) NOT NULL,
    "params" JSON,
    "comment" TEXT,

    CONSTRAINT "TokenConnection_pkey" PRIMARY KEY ("tokenFromId","tokenToId","type")
);

-- CreateIndex
CREATE UNIQUE INDEX "AbstractToken_issuer_symbol_key" ON "AbstractToken"("issuer", "symbol");

-- CreateIndex
CREATE INDEX "DeployedToken_abstractTokenId_idx" ON "DeployedToken"("abstractTokenId");

-- CreateIndex
CREATE UNIQUE INDEX "DeployedToken_chain_address_key" ON "DeployedToken"("chain", "address");

-- CreateIndex
CREATE INDEX "TokenConnection_tokenFromId_idx" ON "TokenConnection"("tokenFromId");

-- CreateIndex
CREATE INDEX "TokenConnection_tokenToId_idx" ON "TokenConnection"("tokenToId");

-- AddForeignKey
ALTER TABLE "DeployedToken" ADD CONSTRAINT "DeployedToken_abstractTokenId_fkey" FOREIGN KEY ("abstractTokenId") REFERENCES "AbstractToken"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenConnection" ADD CONSTRAINT "TokenConnection_tokenFromId_fkey" FOREIGN KEY ("tokenFromId") REFERENCES "DeployedToken"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenConnection" ADD CONSTRAINT "TokenConnection_tokenToId_fkey" FOREIGN KEY ("tokenToId") REFERENCES "DeployedToken"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
