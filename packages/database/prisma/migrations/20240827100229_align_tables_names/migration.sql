/*
  Warnings:

  - You are about to drop the `activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `aggregated_l2_costs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `aggregated_liveness` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `amounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `anomalies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `block_timestamps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `daily_discovery` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `discovery_cache` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `finality` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `indexer_configurations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `indexer_state` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `l2_costs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `l2_costs_prices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `liveness` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sequence_processor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tvl_cleaner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `update_monitor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `update_notifier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `values` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verifier_status` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "activity";

-- DropTable
DROP TABLE "aggregated_l2_costs";

-- DropTable
DROP TABLE "aggregated_liveness";

-- DropTable
DROP TABLE "amounts";

-- DropTable
DROP TABLE "anomalies";

-- DropTable
DROP TABLE "block_timestamps";

-- DropTable
DROP TABLE "daily_discovery";

-- DropTable
DROP TABLE "discovery_cache";

-- DropTable
DROP TABLE "finality";

-- DropTable
DROP TABLE "indexer_configurations";

-- DropTable
DROP TABLE "indexer_state";

-- DropTable
DROP TABLE "l2_costs";

-- DropTable
DROP TABLE "l2_costs_prices";

-- DropTable
DROP TABLE "liveness";

-- DropTable
DROP TABLE "prices";

-- DropTable
DROP TABLE "sequence_processor";

-- DropTable
DROP TABLE "tvl_cleaner";

-- DropTable
DROP TABLE "update_monitor";

-- DropTable
DROP TABLE "update_notifier";

-- DropTable
DROP TABLE "values";

-- DropTable
DROP TABLE "verifier_status";

-- CreateTable
CREATE TABLE "Activity" (
    "project_id" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "count" INTEGER NOT NULL,
    "start" INTEGER NOT NULL DEFAULT 0,
    "end" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("project_id","timestamp")
);

-- CreateTable
CREATE TABLE "AggregatedL2Cost" (
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

    CONSTRAINT "AggregatedL2Cost_pkey" PRIMARY KEY ("project_id","timestamp")
);

-- CreateTable
CREATE TABLE "Amount" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "amount" DECIMAL(80,0) NOT NULL,
    "configuration_id" CHAR(12) NOT NULL,

    CONSTRAINT "Amount_pkey" PRIMARY KEY ("configuration_id","timestamp")
);

-- CreateTable
CREATE TABLE "BlockTimestamp" (
    "chain" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "block_number" INTEGER NOT NULL,

    CONSTRAINT "BlockTimestamp_pkey" PRIMARY KEY ("chain","timestamp")
);

-- CreateTable
CREATE TABLE "DailyDiscovery" (
    "project_name" VARCHAR(255) NOT NULL,
    "chain_id" INTEGER NOT NULL,
    "unix_timestamp" TIMESTAMP(6) NOT NULL,
    "block_number" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "config_hash" VARCHAR(255) NOT NULL,
    "discovery_json_blob" JSONB NOT NULL,

    CONSTRAINT "DailyDiscovery_pkey" PRIMARY KEY ("project_name","chain_id","unix_timestamp")
);

-- CreateTable
CREATE TABLE "DiscoveryCache" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "block_number" INTEGER NOT NULL,
    "chain" VARCHAR(255) NOT NULL,

    CONSTRAINT "DiscoveryCache_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "Finality" (
    "project_id" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "minimum_time_to_inclusion" INTEGER NOT NULL,
    "maximum_time_to_inclusion" INTEGER NOT NULL,
    "average_time_to_inclusion" INTEGER NOT NULL,
    "average_state_update" INTEGER,

    CONSTRAINT "Finality_pkey" PRIMARY KEY ("project_id","timestamp")
);

-- CreateTable
CREATE TABLE "IndexerConfiguration" (
    "id" CHAR(12) NOT NULL,
    "indexer_id" VARCHAR(255) NOT NULL,
    "current_height" INTEGER,
    "min_height" INTEGER NOT NULL,
    "max_height" INTEGER,
    "properties" TEXT NOT NULL,

    CONSTRAINT "IndexerConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndexerState" (
    "indexer_id" VARCHAR(255) NOT NULL,
    "safe_height" INTEGER NOT NULL,
    "min_timestamp" TIMESTAMP(6),
    "config_hash" TEXT,

    CONSTRAINT "IndexerState_pkey" PRIMARY KEY ("indexer_id")
);

-- CreateTable
CREATE TABLE "L2Cost" (
    "configuration_id" VARCHAR(12) NOT NULL,
    "tx_hash" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "gas_used" INTEGER NOT NULL,
    "gas_price" BIGINT NOT NULL,
    "calldata_gas_used" INTEGER NOT NULL,
    "calldata_length" INTEGER NOT NULL,
    "blob_gas_used" INTEGER,
    "blob_gas_price" BIGINT,

    CONSTRAINT "L2Cost_pkey" PRIMARY KEY ("configuration_id","tx_hash")
);

-- CreateTable
CREATE TABLE "L2CostPrice" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "price_usd" REAL NOT NULL,

    CONSTRAINT "L2CostPrice_pkey" PRIMARY KEY ("timestamp")
);

-- CreateTable
CREATE TABLE "Liveness" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "block_number" INTEGER NOT NULL,
    "tx_hash" VARCHAR(255) NOT NULL,
    "configuration_id" VARCHAR(12) NOT NULL,

    CONSTRAINT "Liveness_pkey" PRIMARY KEY ("configuration_id","tx_hash")
);

-- CreateTable
CREATE TABLE "Price" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "price_usd" REAL NOT NULL,
    "configuration_id" CHAR(12) NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("configuration_id","timestamp")
);

-- CreateTable
CREATE TABLE "SequenceProcessor" (
    "id" VARCHAR(255) NOT NULL,
    "last_processed" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "latest" INTEGER NOT NULL,
    "synced_once" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SequenceProcessor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TvlCleaner" (
    "repository_name" VARCHAR(255) NOT NULL,
    "hourly_cleaned_until" TIMESTAMP(6),
    "six_hourly_cleaned_until" TIMESTAMP(6),

    CONSTRAINT "TvlCleaner_pkey" PRIMARY KEY ("repository_name")
);

-- CreateTable
CREATE TABLE "UpdateMonitor" (
    "project_name" VARCHAR(255) NOT NULL,
    "block_number" INTEGER NOT NULL,
    "unix_timestamp" TIMESTAMP(6),
    "discovery_json_blob" JSONB NOT NULL,
    "config_hash" VARCHAR(255) NOT NULL DEFAULT '',
    "version" INTEGER NOT NULL DEFAULT 0,
    "chain_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "UpdateMonitor_pkey" PRIMARY KEY ("project_name","chain_id")
);

-- CreateTable
CREATE TABLE "UpdateNotifier" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_name" VARCHAR(255) NOT NULL,
    "block_number" INTEGER NOT NULL,
    "diff_json_blob" JSONB NOT NULL,
    "chain_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "UpdateNotifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Value" (
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

    CONSTRAINT "Value_pkey" PRIMARY KEY ("timestamp","project_id","data_source")
);

-- CreateTable
CREATE TABLE "VerifierStatus" (
    "address" VARCHAR(255) NOT NULL,
    "chain_id" INTEGER NOT NULL,
    "last_used" TIMESTAMP(6) NOT NULL,
    "last_updated" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "VerifierStatus_pkey" PRIMARY KEY ("address","chain_id")
);

-- CreateTable
CREATE TABLE "AggregatedLiveness" (
    "project_id" VARCHAR(255) NOT NULL,
    "subtype" VARCHAR(255) NOT NULL,
    "range" VARCHAR(255) NOT NULL,
    "min" INTEGER NOT NULL,
    "avg" INTEGER NOT NULL,
    "max" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "AggregatedLiveness_pkey" PRIMARY KEY ("project_id","subtype","range")
);

-- CreateTable
CREATE TABLE "Anomaly" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "project_id" VARCHAR(255) NOT NULL,
    "subtype" VARCHAR(255) NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "Anomaly_pkey" PRIMARY KEY ("timestamp","project_id","subtype")
);

-- CreateIndex
CREATE INDEX "aggregated_l2_costs_project_id_index" ON "AggregatedL2Cost"("project_id");

-- CreateIndex
CREATE INDEX "aggregated_l2_costs_timestamp_index" ON "AggregatedL2Cost"("timestamp");

-- CreateIndex
CREATE INDEX "indexer_configurations_indexer_id_index" ON "IndexerConfiguration"("indexer_id");

-- CreateIndex
CREATE INDEX "update_notifier_block_number_index" ON "UpdateNotifier"("block_number");

-- CreateIndex
CREATE INDEX "update_notifier_project_name_index" ON "UpdateNotifier"("project_name");
