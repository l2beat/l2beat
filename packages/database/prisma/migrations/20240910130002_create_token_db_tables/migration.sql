-- CreateEnum
CREATE TYPE "ExternalBridgeType" AS ENUM ('Axelar', 'LayerZeroV1', 'Orbit', 'Wormhole');

-- CreateEnum
CREATE TYPE "ExplorerType" AS ENUM ('Etherscan');

-- CreateTable
CREATE TABLE "BridgeEscrow" (
    "id" CHAR(21) NOT NULL,
    "networkId" CHAR(21) NOT NULL,
    "address" TEXT NOT NULL,
    "externalBridgeId" CHAR(21),
    "canonicalNetworkId" CHAR(21),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BridgeEscrow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalBridge" (
    "id" CHAR(21) NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "type" "ExternalBridgeType" NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExternalBridge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deployment" (
    "id" CHAR(21) NOT NULL,
    "tokenId" TEXT NOT NULL,
    "txHash" CHAR(66),
    "blockNumber" INTEGER,
    "timestamp" TIMESTAMP(6),
    "from" TEXT,
    "to" TEXT,
    "isDeployerEoa" BOOLEAN,
    "sourceAvailable" BOOLEAN NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Deployment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NetworkRpc" (
    "id" CHAR(21) NOT NULL,
    "networkId" CHAR(21) NOT NULL,
    "url" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NetworkRpc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NetworkExplorer" (
    "id" CHAR(21) NOT NULL,
    "networkId" CHAR(21) NOT NULL,
    "type" "ExplorerType" NOT NULL,
    "url" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NetworkExplorer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Network" (
    "id" CHAR(21) NOT NULL,
    "chainId" INTEGER NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "coingeckoId" VARCHAR(256),
    "axelarId" VARCHAR(256),
    "axelarGatewayAddress" CHAR(42),
    "orbitId" VARCHAR(256),
    "wormholeId" VARCHAR(256),
    "layerZeroV1EndpointAddress" CHAR(42),
    "logoUrl" VARCHAR(256),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Network_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenBridge" (
    "id" CHAR(21) NOT NULL,
    "sourceTokenId" CHAR(21) NOT NULL,
    "targetTokenId" CHAR(21) NOT NULL,
    "externalBridgeId" CHAR(21),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenBridge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenMeta" (
    "id" CHAR(21) NOT NULL,
    "tokenId" CHAR(21) NOT NULL,
    "externalId" VARCHAR(256),
    "source" VARCHAR(256) NOT NULL,
    "name" VARCHAR(256),
    "symbol" VARCHAR(32),
    "decimals" INTEGER,
    "logoUrl" VARCHAR(256),
    "contractName" VARCHAR(256),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" CHAR(21) NOT NULL,
    "networkId" CHAR(21) NOT NULL,
    "address" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cache" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "blockNumber" INTEGER,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cache_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "_BridgeEscrowToToken" (
    "A" CHAR(21) NOT NULL,
    "B" CHAR(21) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BridgeEscrow_networkId_address_key" ON "BridgeEscrow"("networkId", "address");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalBridge_type_key" ON "ExternalBridge"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Deployment_tokenId_key" ON "Deployment"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "NetworkExplorer_networkId_key" ON "NetworkExplorer"("networkId");

-- CreateIndex
CREATE UNIQUE INDEX "NetworkExplorer_networkId_type_key" ON "NetworkExplorer"("networkId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Network_coingeckoId_key" ON "Network"("coingeckoId");

-- CreateIndex
CREATE UNIQUE INDEX "TokenBridge_targetTokenId_key" ON "TokenBridge"("targetTokenId");

-- CreateIndex
CREATE UNIQUE INDEX "TokenMeta_tokenId_source_key" ON "TokenMeta"("tokenId", "source");

-- CreateIndex
CREATE UNIQUE INDEX "Token_networkId_address_key" ON "Token"("networkId", "address");

-- CreateIndex
CREATE UNIQUE INDEX "_BridgeEscrowToToken_AB_unique" ON "_BridgeEscrowToToken"("A", "B");

-- CreateIndex
CREATE INDEX "_BridgeEscrowToToken_B_index" ON "_BridgeEscrowToToken"("B");

-- AddForeignKey
ALTER TABLE "BridgeEscrow" ADD CONSTRAINT "BridgeEscrow_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "Network"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BridgeEscrow" ADD CONSTRAINT "BridgeEscrow_externalBridgeId_fkey" FOREIGN KEY ("externalBridgeId") REFERENCES "ExternalBridge"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BridgeEscrow" ADD CONSTRAINT "BridgeEscrow_canonicalNetworkId_fkey" FOREIGN KEY ("canonicalNetworkId") REFERENCES "Network"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkRpc" ADD CONSTRAINT "NetworkRpc_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "Network"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NetworkExplorer" ADD CONSTRAINT "NetworkExplorer_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "Network"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenBridge" ADD CONSTRAINT "TokenBridge_sourceTokenId_fkey" FOREIGN KEY ("sourceTokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenBridge" ADD CONSTRAINT "TokenBridge_targetTokenId_fkey" FOREIGN KEY ("targetTokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenBridge" ADD CONSTRAINT "TokenBridge_externalBridgeId_fkey" FOREIGN KEY ("externalBridgeId") REFERENCES "ExternalBridge"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenMeta" ADD CONSTRAINT "TokenMeta_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "Network"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BridgeEscrowToToken" ADD CONSTRAINT "_BridgeEscrowToToken_A_fkey" FOREIGN KEY ("A") REFERENCES "BridgeEscrow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BridgeEscrowToToken" ADD CONSTRAINT "_BridgeEscrowToToken_B_fkey" FOREIGN KEY ("B") REFERENCES "Token"("id") ON DELETE CASCADE ON UPDATE CASCADE;
