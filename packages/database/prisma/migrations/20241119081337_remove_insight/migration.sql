/*
  Warnings:

  - You are about to drop the `BridgeEscrow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cache` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Deployment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Entity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExternalBridge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InsightBalance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InsightUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Network` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NetworkExplorer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NetworkRpc` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Token` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TokenBridge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TokenMeta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BridgeEscrowToToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EntityToExternalBridge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EntityToToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BridgeEscrow" DROP CONSTRAINT "BridgeEscrow_canonicalNetworkId_fkey";

-- DropForeignKey
ALTER TABLE "BridgeEscrow" DROP CONSTRAINT "BridgeEscrow_externalBridgeId_fkey";

-- DropForeignKey
ALTER TABLE "BridgeEscrow" DROP CONSTRAINT "BridgeEscrow_networkId_fkey";

-- DropForeignKey
ALTER TABLE "Deployment" DROP CONSTRAINT "Deployment_tokenId_fkey";

-- DropForeignKey
ALTER TABLE "InsightBalance" DROP CONSTRAINT "InsightBalance_tokenId_fkey";

-- DropForeignKey
ALTER TABLE "InsightBalance" DROP CONSTRAINT "InsightBalance_userId_fkey";

-- DropForeignKey
ALTER TABLE "NetworkExplorer" DROP CONSTRAINT "NetworkExplorer_networkId_fkey";

-- DropForeignKey
ALTER TABLE "NetworkRpc" DROP CONSTRAINT "NetworkRpc_networkId_fkey";

-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_networkId_fkey";

-- DropForeignKey
ALTER TABLE "TokenBridge" DROP CONSTRAINT "TokenBridge_externalBridgeId_fkey";

-- DropForeignKey
ALTER TABLE "TokenBridge" DROP CONSTRAINT "TokenBridge_sourceTokenId_fkey";

-- DropForeignKey
ALTER TABLE "TokenBridge" DROP CONSTRAINT "TokenBridge_targetTokenId_fkey";

-- DropForeignKey
ALTER TABLE "TokenMeta" DROP CONSTRAINT "TokenMeta_tokenId_fkey";

-- DropForeignKey
ALTER TABLE "_BridgeEscrowToToken" DROP CONSTRAINT "_BridgeEscrowToToken_A_fkey";

-- DropForeignKey
ALTER TABLE "_BridgeEscrowToToken" DROP CONSTRAINT "_BridgeEscrowToToken_B_fkey";

-- DropForeignKey
ALTER TABLE "_EntityToExternalBridge" DROP CONSTRAINT "_EntityToExternalBridge_A_fkey";

-- DropForeignKey
ALTER TABLE "_EntityToExternalBridge" DROP CONSTRAINT "_EntityToExternalBridge_B_fkey";

-- DropForeignKey
ALTER TABLE "_EntityToToken" DROP CONSTRAINT "_EntityToToken_A_fkey";

-- DropForeignKey
ALTER TABLE "_EntityToToken" DROP CONSTRAINT "_EntityToToken_B_fkey";

-- DropTable
DROP TABLE "BridgeEscrow";

-- DropTable
DROP TABLE "Cache";

-- DropTable
DROP TABLE "Deployment";

-- DropTable
DROP TABLE "Entity";

-- DropTable
DROP TABLE "ExternalBridge";

-- DropTable
DROP TABLE "InsightBalance";

-- DropTable
DROP TABLE "InsightUser";

-- DropTable
DROP TABLE "Network";

-- DropTable
DROP TABLE "NetworkExplorer";

-- DropTable
DROP TABLE "NetworkRpc";

-- DropTable
DROP TABLE "Token";

-- DropTable
DROP TABLE "TokenBridge";

-- DropTable
DROP TABLE "TokenMeta";

-- DropTable
DROP TABLE "_BridgeEscrowToToken";

-- DropTable
DROP TABLE "_EntityToExternalBridge";

-- DropTable
DROP TABLE "_EntityToToken";

-- DropEnum
DROP TYPE "ExplorerType";

-- DropEnum
DROP TYPE "ExternalBridgeType";

-- DropEnum
DROP TYPE "NetworkType";
