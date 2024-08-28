-- CreateTable
CREATE TABLE "CurrentPrice" (
    "coingeckoId" VARCHAR(255) NOT NULL,
    "priceUsd" REAL NOT NULL,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "CurrentPrice_pkey" PRIMARY KEY ("coingeckoId")
);

-- CreateTable
CREATE TABLE "Stake" (
    "id" VARCHAR(255) NOT NULL,
    "totalStake" REAL NOT NULL,
    "thresholdStake" REAL NOT NULL,

    CONSTRAINT "Stake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity" (
    "project_id" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "count" INTEGER NOT NULL,
    "start" INTEGER NOT NULL DEFAULT 0,
    "end" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "activity_pkey" PRIMARY KEY ("project_id","timestamp")
);

-- CreateTable
CREATE TABLE "aggregated_l2_costs" (
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
CREATE TABLE "amounts" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "amount" DECIMAL(80,0) NOT NULL,
    "configuration_id" CHAR(12) NOT NULL,

    CONSTRAINT "amounts_pkey" PRIMARY KEY ("configuration_id","timestamp")
);

-- CreateTable
CREATE TABLE "block_timestamps" (
    "chain" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "block_number" INTEGER NOT NULL,

    CONSTRAINT "block_timestamps_pkey" PRIMARY KEY ("chain","timestamp")
);

-- CreateTable
CREATE TABLE "daily_discovery" (
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
CREATE TABLE "discovery_cache" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "block_number" INTEGER NOT NULL,
    "chain" VARCHAR(255) NOT NULL,

    CONSTRAINT "discovery_cache_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "finality" (
    "project_id" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "minimum_time_to_inclusion" INTEGER NOT NULL,
    "maximum_time_to_inclusion" INTEGER NOT NULL,
    "average_time_to_inclusion" INTEGER NOT NULL,
    "average_state_update" INTEGER,

    CONSTRAINT "finality_pkey" PRIMARY KEY ("project_id","timestamp")
);

-- CreateTable
CREATE TABLE "indexer_configurations" (
    "id" CHAR(12) NOT NULL,
    "indexer_id" VARCHAR(255) NOT NULL,
    "current_height" INTEGER,
    "min_height" INTEGER NOT NULL,
    "max_height" INTEGER,
    "properties" TEXT NOT NULL,

    CONSTRAINT "indexer_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indexer_state" (
    "indexer_id" VARCHAR(255) NOT NULL,
    "safe_height" INTEGER NOT NULL,
    "min_timestamp" TIMESTAMP(6),
    "config_hash" TEXT,

    CONSTRAINT "indexer_state_pkey" PRIMARY KEY ("indexer_id")
);

-- CreateTable
CREATE TABLE "l2_costs" (
    "configuration_id" VARCHAR(12) NOT NULL,
    "tx_hash" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "gas_used" INTEGER NOT NULL,
    "gas_price" BIGINT NOT NULL,
    "calldata_gas_used" INTEGER NOT NULL,
    "calldata_length" INTEGER NOT NULL,
    "blob_gas_used" INTEGER,
    "blob_gas_price" BIGINT,

    CONSTRAINT "l2_costs_pkey" PRIMARY KEY ("configuration_id","tx_hash")
);

-- CreateTable
CREATE TABLE "l2_costs_prices" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "price_usd" REAL NOT NULL,

    CONSTRAINT "l2_costs_prices_pkey" PRIMARY KEY ("timestamp")
);

-- CreateTable
CREATE TABLE "liveness" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "block_number" INTEGER NOT NULL,
    "tx_hash" VARCHAR(255) NOT NULL,
    "configuration_id" VARCHAR(12) NOT NULL,

    CONSTRAINT "liveness_pkey" PRIMARY KEY ("configuration_id","tx_hash")
);

-- CreateTable
CREATE TABLE "prices" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "price_usd" REAL NOT NULL,
    "configuration_id" CHAR(12) NOT NULL,

    CONSTRAINT "prices_pkey" PRIMARY KEY ("configuration_id","timestamp")
);

-- CreateTable
CREATE TABLE "sequence_processor" (
    "id" VARCHAR(255) NOT NULL,
    "last_processed" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "latest" INTEGER NOT NULL,
    "synced_once" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sequence_processor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tvl_cleaner" (
    "repository_name" VARCHAR(255) NOT NULL,
    "hourly_cleaned_until" TIMESTAMP(6),
    "six_hourly_cleaned_until" TIMESTAMP(6),

    CONSTRAINT "tvl_cleaner_pkey" PRIMARY KEY ("repository_name")
);

-- CreateTable
CREATE TABLE "update_monitor" (
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
CREATE TABLE "update_notifier" (
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
CREATE TABLE "values" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "project_id" VARCHAR(255) NOT NULL,
    "data_source" VARCHAR(255) NOT NULL,
    "external" BIGINT,
    "external_associated" BIGINT NOT NULL DEFAULT 0,
    "external_for_total" BIGINT,
    "external_associated_for_total" BIGINT NOT NULL DEFAULT 0,
    "canonical" BIGINT,
    "canonical_associated" BIGINT NOT NULL DEFAULT 0,
    "canonical_for_total" BIGINT,
    "canonical_associated_for_total" BIGINT NOT NULL DEFAULT 0,
    "native" BIGINT,
    "native_associated" BIGINT NOT NULL DEFAULT 0,
    "native_for_total" BIGINT,
    "native_associated_for_total" BIGINT NOT NULL DEFAULT 0,
    "ether" BIGINT NOT NULL DEFAULT 0,
    "stablecoin" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "values_pkey" PRIMARY KEY ("timestamp","project_id","data_source")
);

-- CreateTable
CREATE TABLE "verifier_status" (
    "address" VARCHAR(255) NOT NULL,
    "chain_id" INTEGER NOT NULL,
    "last_used" TIMESTAMP(6) NOT NULL,
    "last_updated" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "verifier_status_pkey" PRIMARY KEY ("address","chain_id")
);

-- CreateTable
CREATE TABLE "aggregated_liveness" (
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
CREATE TABLE "anomalies" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "project_id" VARCHAR(255) NOT NULL,
    "subtype" VARCHAR(255) NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "anomalies_pkey" PRIMARY KEY ("timestamp","project_id","subtype")
);

-- CreateIndex
CREATE INDEX "aggregated_l2_costs_project_id_index" ON "aggregated_l2_costs"("project_id");

-- CreateIndex
CREATE INDEX "aggregated_l2_costs_timestamp_index" ON "aggregated_l2_costs"("timestamp");

-- CreateIndex
CREATE INDEX "indexer_configurations_indexer_id_index" ON "indexer_configurations"("indexer_id");

-- CreateIndex
CREATE INDEX "update_notifier_block_number_index" ON "update_notifier"("block_number");

-- CreateIndex
CREATE INDEX "update_notifier_project_name_index" ON "update_notifier"("project_name");

