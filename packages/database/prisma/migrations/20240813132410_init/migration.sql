-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "activity";

-- CreateEnum
CREATE TYPE "public"."ExternalBridgeType" AS ENUM ('Axelar', 'LayerZeroV1', 'Orbit', 'Wormhole');

-- CreateEnum
CREATE TYPE "public"."ExplorerType" AS ENUM ('Etherscan');

-- CreateTable
CREATE TABLE "public"."CurrentPrice" (
    "coingeckoId" VARCHAR(255) NOT NULL,
    "priceUsd" REAL NOT NULL,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "CurrentPrice_pkey" PRIMARY KEY ("coingeckoId")
);

-- CreateTable
CREATE TABLE "public"."Stake" (
    "id" VARCHAR(255) NOT NULL,
    "totalStake" BIGINT NOT NULL,
    "thresholdStake" BIGINT NOT NULL,

    CONSTRAINT "Stake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BridgeEscrow" (
    "id" CHAR(21) NOT NULL,
    "networkId" CHAR(21) NOT NULL,
    "address" TEXT NOT NULL,
    "externalBridgeId" CHAR(21),
    "canonicalNetworkId" CHAR(21),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BridgeEscrow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ExternalBridge" (
    "id" CHAR(21) NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "type" "public"."ExternalBridgeType" NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExternalBridge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Deployment" (
    "id" CHAR(21) NOT NULL,
    "tokenId" TEXT NOT NULL,
    "txHash" CHAR(66),
    "blockNumber" INTEGER,
    "timestamp" TIMESTAMP(6),
    "from" TEXT,
    "to" TEXT,
    "isDeployerEoa" BOOLEAN,
    "sourceAvailable" BOOLEAN NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Deployment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NetworkRpc" (
    "id" CHAR(21) NOT NULL,
    "networkId" CHAR(21) NOT NULL,
    "url" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NetworkRpc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NetworkExplorer" (
    "id" CHAR(21) NOT NULL,
    "networkId" CHAR(21) NOT NULL,
    "type" "public"."ExplorerType" NOT NULL,
    "url" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NetworkExplorer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Network" (
    "id" CHAR(21) NOT NULL,
    "chainId" INTEGER NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "coingeckoId" VARCHAR(256),
    "axelarId" VARCHAR(256),
    "axelarGatewayAddress" CHAR(42),
    "orbitId" VARCHAR(256),
    "wormholeId" VARCHAR(256),
    "layerZeroV1EndpointAddress" CHAR(42),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Network_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TokenBridge" (
    "id" CHAR(21) NOT NULL,
    "sourceTokenId" CHAR(21) NOT NULL,
    "targetTokenId" CHAR(21) NOT NULL,
    "externalBridgeId" CHAR(21),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenBridge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TokenMeta" (
    "id" CHAR(21) NOT NULL,
    "tokenId" CHAR(21) NOT NULL,
    "externalId" VARCHAR(256),
    "source" VARCHAR(256) NOT NULL,
    "name" VARCHAR(256),
    "symbol" VARCHAR(32),
    "decimals" INTEGER,
    "logoUrl" VARCHAR(256),
    "contractName" VARCHAR(256),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Token" (
    "id" CHAR(21) NOT NULL,
    "networkId" CHAR(21) NOT NULL,
    "address" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cache" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "blockNumber" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cache_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "public"."activity" (
    "project_id" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "count" INTEGER NOT NULL,
    "start" INTEGER NOT NULL,
    "end" INTEGER NOT NULL,

    CONSTRAINT "activity_pkey" PRIMARY KEY ("project_id","timestamp")
);

-- CreateTable
CREATE TABLE "public"."aggregated_l2_costs" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "project_id" VARCHAR(255) NOT NULL,
    "total_gas" INTEGER NOT NULL,
    "total_gas_eth" REAL NOT NULL,
    "total_gas_usd" REAL NOT NULL,
    "blobs_gas" INTEGER,
    "blobs_gas_eth" REAL,
    "blobs_gas_usd" REAL,
    "calldata_gas" INTEGER NOT NULL,
    "calldata_gas_eth" REAL NOT NULL,
    "calldata_gas_usd" REAL NOT NULL,
    "compute_gas" INTEGER NOT NULL,
    "compute_gas_eth" REAL NOT NULL,
    "compute_gas_usd" REAL NOT NULL,
    "overhead_gas_eth" REAL NOT NULL,
    "overhead_gas_usd" REAL NOT NULL,
    "overhead_gas" INTEGER NOT NULL,

    CONSTRAINT "aggregated_l2_costs_pkey" PRIMARY KEY ("project_id","timestamp")
);

-- CreateTable
CREATE TABLE "public"."amounts" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "amount" DECIMAL(80,0) NOT NULL,
    "configuration_id" CHAR(12) NOT NULL,

    CONSTRAINT "amounts_pkey" PRIMARY KEY ("configuration_id","timestamp")
);

-- CreateTable
CREATE TABLE "public"."block_timestamps" (
    "chain" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "block_number" INTEGER NOT NULL,

    CONSTRAINT "block_timestamps_pkey" PRIMARY KEY ("chain","timestamp")
);

-- CreateTable
CREATE TABLE "public"."daily_discovery" (
    "project_name" VARCHAR(255) NOT NULL,
    "chain_id" INTEGER NOT NULL,
    "unix_timestamp" TIMESTAMP(6) NOT NULL,
    "block_number" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "config_hash" VARCHAR(255) NOT NULL,
    "discovery_json_blob" JSONB NOT NULL,

    CONSTRAINT "daily_discovery_pkey" PRIMARY KEY ("project_name","chain_id","unix_timestamp")
);

-- CreateTable
CREATE TABLE "public"."discovery_cache" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "block_number" INTEGER NOT NULL,
    "chain" VARCHAR(255) NOT NULL,

    CONSTRAINT "discovery_cache_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "public"."finality" (
    "project_id" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "minimum_time_to_inclusion" INTEGER NOT NULL,
    "maximum_time_to_inclusion" INTEGER NOT NULL,
    "average_time_to_inclusion" INTEGER NOT NULL,
    "average_state_update" INTEGER,

    CONSTRAINT "finality_pkey" PRIMARY KEY ("project_id","timestamp")
);

-- CreateTable
CREATE TABLE "public"."indexer_configurations" (
    "id" CHAR(12) NOT NULL,
    "indexer_id" VARCHAR(255) NOT NULL,
    "current_height" INTEGER,
    "min_height" INTEGER NOT NULL,
    "max_height" INTEGER,
    "properties" TEXT NOT NULL,

    CONSTRAINT "indexer_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."indexer_state" (
    "indexer_id" VARCHAR(255) NOT NULL,
    "safe_height" INTEGER NOT NULL,
    "min_timestamp" TIMESTAMP(6),
    "config_hash" TEXT,

    CONSTRAINT "indexer_state_pkey" PRIMARY KEY ("indexer_id")
);

-- CreateTable
CREATE TABLE "public"."l2_costs" (
    "configuration_id" VARCHAR(12) NOT NULL,
    "tx_hash" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "gas_used" INTEGER NOT NULL,
    "gas_price" BIGINT NOT NULL,
    "calldata_gas_used" INTEGER NOT NULL,
    "calldata_length" INTEGER NOT NULL,
    "blob_gas_used" INTEGER,
    "blob_gas_price" BIGINT
);

-- CreateTable
CREATE TABLE "public"."l2_costs_prices" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "price_usd" REAL NOT NULL,

    CONSTRAINT "l2_costs_prices_pkey" PRIMARY KEY ("timestamp")
);

-- CreateTable
CREATE TABLE "public"."liveness" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "block_number" INTEGER NOT NULL,
    "tx_hash" VARCHAR(255) NOT NULL,
    "configuration_id" VARCHAR(12) NOT NULL,

    CONSTRAINT "liveness_configuration_id_index" PRIMARY KEY ("configuration_id")
);

-- CreateTable
CREATE TABLE "public"."prices" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "price_usd" REAL NOT NULL,
    "configuration_id" CHAR(12) NOT NULL,

    CONSTRAINT "prices_pkey" PRIMARY KEY ("configuration_id","timestamp")
);

-- CreateTable
CREATE TABLE "public"."sequence_processor" (
    "id" VARCHAR(255) NOT NULL,
    "last_processed" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "latest" INTEGER NOT NULL,
    "synced_once" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sequence_processor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tvl_cleaner" (
    "repository_name" VARCHAR(255) NOT NULL,
    "hourly_cleaned_until" TIMESTAMP(6),
    "six_hourly_cleaned_until" TIMESTAMP(6),

    CONSTRAINT "tvl_cleaner_pkey" PRIMARY KEY ("repository_name")
);

-- CreateTable
CREATE TABLE "public"."update_monitor" (
    "project_name" VARCHAR(255) NOT NULL,
    "block_number" INTEGER NOT NULL,
    "unix_timestamp" TIMESTAMP(6),
    "discovery_json_blob" JSONB NOT NULL,
    "config_hash" VARCHAR(255) NOT NULL DEFAULT '',
    "version" INTEGER NOT NULL DEFAULT 0,
    "chain_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "update_monitor_pkey" PRIMARY KEY ("project_name","chain_id")
);

-- CreateTable
CREATE TABLE "public"."update_notifier" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_name" VARCHAR(255) NOT NULL,
    "block_number" INTEGER NOT NULL,
    "diff_json_blob" JSONB NOT NULL,
    "chain_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "update_notifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."values" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "project_id" VARCHAR(255) NOT NULL,
    "data_source" VARCHAR(255) NOT NULL,
    "external" BIGINT NOT NULL,
    "external_associated" BIGINT NOT NULL DEFAULT 0,
    "external_for_total" BIGINT NOT NULL,
    "external_associated_for_total" BIGINT NOT NULL DEFAULT 0,
    "canonical" BIGINT NOT NULL,
    "canonical_associated" BIGINT NOT NULL DEFAULT 0,
    "canonical_for_total" BIGINT NOT NULL,
    "canonical_associated_for_total" BIGINT NOT NULL DEFAULT 0,
    "native" BIGINT NOT NULL,
    "native_associated" BIGINT NOT NULL DEFAULT 0,
    "native_for_total" BIGINT NOT NULL,
    "native_associated_for_total" BIGINT NOT NULL DEFAULT 0,
    "ether" BIGINT NOT NULL DEFAULT 0,
    "stablecoin" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "values_pkey" PRIMARY KEY ("timestamp","project_id","data_source")
);

-- CreateTable
CREATE TABLE "public"."verifier_status" (
    "address" VARCHAR(255) NOT NULL,
    "chain_id" INTEGER NOT NULL,
    "last_used" TIMESTAMP(6) NOT NULL,
    "last_updated" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "verifier_status_pkey" PRIMARY KEY ("address","chain_id")
);

-- CreateTable
CREATE TABLE "activity"."block" (
    "project_id" VARCHAR(255) NOT NULL,
    "unix_timestamp" TIMESTAMP(6) NOT NULL,
    "count" INTEGER NOT NULL,
    "block_number" INTEGER NOT NULL,

    CONSTRAINT "block_pkey" PRIMARY KEY ("project_id","block_number")
);

-- CreateTable
CREATE TABLE "activity"."starkex" (
    "project_id" VARCHAR(255) NOT NULL,
    "unix_timestamp" TIMESTAMP(6) NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "starkex_pkey" PRIMARY KEY ("project_id","unix_timestamp")
);

-- CreateTable
CREATE TABLE "activity"."zksync" (
    "block_number" INTEGER NOT NULL,
    "block_index" INTEGER NOT NULL,
    "unix_timestamp" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "zksync_pkey" PRIMARY KEY ("block_number","block_index")
);

-- CreateTable
CREATE TABLE "public"."aggregated_liveness" (
    "project_id" VARCHAR(255) NOT NULL,
    "subtype" VARCHAR(255) NOT NULL,
    "range" VARCHAR(255) NOT NULL,
    "min" INTEGER NOT NULL,
    "avg" INTEGER NOT NULL,
    "max" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "aggregated_liveness_pkey" PRIMARY KEY ("project_id","subtype","range")
);

-- CreateTable
CREATE TABLE "public"."anomalies" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "project_id" VARCHAR(255) NOT NULL,
    "subtype" VARCHAR(255) NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "anomalies_pkey" PRIMARY KEY ("timestamp","project_id","subtype")
);

-- CreateTable
CREATE TABLE "public"."_BridgeEscrowToToken" (
    "A" CHAR(21) NOT NULL,
    "B" CHAR(21) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BridgeEscrow_networkId_address_key" ON "public"."BridgeEscrow"("networkId", "address");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalBridge_type_key" ON "public"."ExternalBridge"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Deployment_tokenId_key" ON "public"."Deployment"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "NetworkExplorer_networkId_key" ON "public"."NetworkExplorer"("networkId");

-- CreateIndex
CREATE UNIQUE INDEX "NetworkExplorer_networkId_type_key" ON "public"."NetworkExplorer"("networkId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Network_coingeckoId_key" ON "public"."Network"("coingeckoId");

-- CreateIndex
CREATE UNIQUE INDEX "TokenBridge_targetTokenId_key" ON "public"."TokenBridge"("targetTokenId");

-- CreateIndex
CREATE UNIQUE INDEX "TokenMeta_tokenId_source_key" ON "public"."TokenMeta"("tokenId", "source");

-- CreateIndex
CREATE UNIQUE INDEX "Token_networkId_address_key" ON "public"."Token"("networkId", "address");

-- CreateIndex
CREATE INDEX "activity_project_id_index" ON "public"."activity"("project_id");

-- CreateIndex
CREATE INDEX "activity_timestamp_index" ON "public"."activity"("timestamp");

-- CreateIndex
CREATE INDEX "aggregated_l2_costs_project_id_index" ON "public"."aggregated_l2_costs"("project_id");

-- CreateIndex
CREATE INDEX "aggregated_l2_costs_timestamp_index" ON "public"."aggregated_l2_costs"("timestamp");

-- CreateIndex
CREATE INDEX "indexer_configurations_indexer_id_index" ON "public"."indexer_configurations"("indexer_id");

-- CreateIndex
CREATE UNIQUE INDEX "l2_costs_tx_hash_unique" ON "public"."l2_costs"("tx_hash");

-- CreateIndex
CREATE INDEX "l2_costs_configuration_id_index" ON "public"."l2_costs"("configuration_id");

-- CreateIndex
CREATE INDEX "update_notifier_block_number_index" ON "public"."update_notifier"("block_number");

-- CreateIndex
CREATE INDEX "update_notifier_project_name_index" ON "public"."update_notifier"("project_name");

-- CreateIndex
CREATE UNIQUE INDEX "_BridgeEscrowToToken_AB_unique" ON "public"."_BridgeEscrowToToken"("A", "B");

-- CreateIndex
CREATE INDEX "_BridgeEscrowToToken_B_index" ON "public"."_BridgeEscrowToToken"("B");

-- AddForeignKey
ALTER TABLE "public"."BridgeEscrow" ADD CONSTRAINT "BridgeEscrow_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "public"."Network"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BridgeEscrow" ADD CONSTRAINT "BridgeEscrow_externalBridgeId_fkey" FOREIGN KEY ("externalBridgeId") REFERENCES "public"."ExternalBridge"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BridgeEscrow" ADD CONSTRAINT "BridgeEscrow_canonicalNetworkId_fkey" FOREIGN KEY ("canonicalNetworkId") REFERENCES "public"."Network"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Deployment" ADD CONSTRAINT "Deployment_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "public"."Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NetworkRpc" ADD CONSTRAINT "NetworkRpc_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "public"."Network"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NetworkExplorer" ADD CONSTRAINT "NetworkExplorer_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "public"."Network"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TokenBridge" ADD CONSTRAINT "TokenBridge_sourceTokenId_fkey" FOREIGN KEY ("sourceTokenId") REFERENCES "public"."Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TokenBridge" ADD CONSTRAINT "TokenBridge_targetTokenId_fkey" FOREIGN KEY ("targetTokenId") REFERENCES "public"."Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TokenBridge" ADD CONSTRAINT "TokenBridge_externalBridgeId_fkey" FOREIGN KEY ("externalBridgeId") REFERENCES "public"."ExternalBridge"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TokenMeta" ADD CONSTRAINT "TokenMeta_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "public"."Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Token" ADD CONSTRAINT "Token_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "public"."Network"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BridgeEscrowToToken" ADD CONSTRAINT "_BridgeEscrowToToken_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."BridgeEscrow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BridgeEscrowToToken" ADD CONSTRAINT "_BridgeEscrowToToken_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Token"("id") ON DELETE CASCADE ON UPDATE CASCADE;
