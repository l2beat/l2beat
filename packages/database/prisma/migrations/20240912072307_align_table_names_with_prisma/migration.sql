-- Rename Tables
ALTER TABLE "activity" RENAME TO "Activity";
ALTER TABLE "aggregated_l2_costs" RENAME TO "AggregatedL2Cost";
ALTER TABLE "aggregated_liveness" RENAME TO "AggregatedLiveness";
ALTER TABLE "amounts" RENAME TO "Amount";
ALTER TABLE "anomalies" RENAME TO "Anomaly";
ALTER TABLE "block_timestamps" RENAME TO "BlockTimestamp";
ALTER TABLE "daily_discovery" RENAME TO "DailyDiscovery";
ALTER TABLE "discovery_cache" RENAME TO "DiscoveryCache";
ALTER TABLE "finality" RENAME TO "Finality";
ALTER TABLE "indexer_configurations" RENAME TO "IndexerConfiguration";
ALTER TABLE "indexer_state" RENAME TO "IndexerState";
ALTER TABLE "l2_costs" RENAME TO "L2Cost";
ALTER TABLE "l2_costs_prices" RENAME TO "L2CostPrice";
ALTER TABLE "liveness" RENAME TO "Liveness";
ALTER TABLE "prices" RENAME TO "Price";
ALTER TABLE "tvl_cleaner" RENAME TO "TvlCleaner";
ALTER TABLE "update_monitor" RENAME TO "UpdateMonitor";
ALTER TABLE "update_notifier" RENAME TO "UpdateNotifier";
ALTER TABLE "values" RENAME TO "Value";
ALTER TABLE "verifier_status" RENAME TO "VerifierStatus";

-- Rename constraints
ALTER TABLE "Activity" RENAME CONSTRAINT "activity_pkey" TO "Activity_pkey";
ALTER TABLE "AggregatedL2Cost" RENAME CONSTRAINT "aggregated_l2_costs_pkey" TO "AggregatedL2Cost_pkey";
ALTER TABLE "AggregatedLiveness" RENAME CONSTRAINT "aggregated_liveness_pkey" TO "AggregatedLiveness_pkey";
ALTER TABLE "Amount" RENAME CONSTRAINT "amounts_pkey" TO "Amount_pkey";
ALTER TABLE "Anomaly" RENAME CONSTRAINT "anomalies_pkey" TO "Anomaly_pkey";
ALTER TABLE "BlockTimestamp" RENAME CONSTRAINT "block_timestamps_pkey" TO "BlockTimestamp_pkey";
ALTER TABLE "DailyDiscovery" RENAME CONSTRAINT "daily_discovery_pkey" TO "DailyDiscovery_pkey";
ALTER TABLE "DiscoveryCache" RENAME CONSTRAINT "discovery_cache_pkey" TO "DiscoveryCache_pkey";
ALTER TABLE "Finality" RENAME CONSTRAINT "finality_pkey" TO "Finality_pkey";
ALTER TABLE "IndexerConfiguration" RENAME CONSTRAINT "indexer_configurations_pkey" TO "IndexerConfiguration_pkey";
ALTER TABLE "IndexerState" RENAME CONSTRAINT "indexer_state_pkey" TO "IndexerState_pkey";
ALTER TABLE "L2Cost" RENAME CONSTRAINT "l2_costs_pkey" TO "L2Cost_pkey";
ALTER TABLE "L2CostPrice" RENAME CONSTRAINT "l2_costs_prices_pkey" TO "L2CostPrice_pkey";
ALTER TABLE "Liveness" RENAME CONSTRAINT "liveness_pkey" TO "Liveness_pkey";
ALTER TABLE "Price" RENAME CONSTRAINT "prices_pkey" TO "Price_pkey";
ALTER TABLE "TvlCleaner" RENAME CONSTRAINT "tvl_cleaner_pkey" TO "TvlCleaner_pkey";
ALTER TABLE "UpdateMonitor" RENAME CONSTRAINT "update_monitor_pkey" TO "UpdateMonitor_pkey";
ALTER TABLE "UpdateNotifier" RENAME CONSTRAINT "update_notifier_pkey" TO "UpdateNotifier_pkey";
ALTER TABLE "Value" RENAME CONSTRAINT "values_pkey" TO "Value_pkey";
ALTER TABLE "VerifierStatus" RENAME CONSTRAINT "verifier_status_pkey" TO "VerifierStatus_pkey";

-- Rename columns
ALTER TABLE "Activity" RENAME COLUMN "project_id" TO "projectId";

ALTER TABLE "AggregatedL2Cost" RENAME COLUMN "project_id" TO "projectId";
ALTER TABLE "AggregatedL2Cost" RENAME COLUMN "total_gas" TO "totalGas";
ALTER TABLE "AggregatedL2Cost" RENAME COLUMN "total_gas_eth" TO "totalGasEth";
ALTER TABLE "AggregatedL2Cost" RENAME COLUMN "total_gas_usd" TO "totalGasUsd";
ALTER TABLE "AggregatedL2Cost" RENAME COLUMN "blobs_gas" TO "blobsGas";
ALTER TABLE "AggregatedL2Cost" RENAME COLUMN "blobs_gas_eth" TO "blobsGasEth";
ALTER TABLE "AggregatedL2Cost" RENAME COLUMN "blobs_gas_usd" TO "blobsGasUsd";
ALTER TABLE "AggregatedL2Cost" RENAME COLUMN "calldata_gas" TO "calldataGas";
ALTER TABLE "AggregatedL2Cost" RENAME COLUMN "calldata_gas_eth" TO "calldataGasEth";
ALTER TABLE "AggregatedL2Cost" RENAME COLUMN "calldata_gas_usd" TO "calldataGasUsd";
ALTER TABLE "AggregatedL2Cost" RENAME COLUMN "compute_gas" TO "computeGas";
ALTER TABLE "AggregatedL2Cost" RENAME COLUMN "compute_gas_eth" TO "computeGasEth";
ALTER TABLE "AggregatedL2Cost" RENAME COLUMN "compute_gas_usd" TO "computeGasUsd";
ALTER TABLE "AggregatedL2Cost" RENAME COLUMN "overhead_gas" TO "overheadGas";
ALTER TABLE "AggregatedL2Cost" RENAME COLUMN "overhead_gas_eth" TO "overheadGasEth";
ALTER TABLE "AggregatedL2Cost" RENAME COLUMN "overhead_gas_usd" TO "overheadGasUsd";

ALTER TABLE "AggregatedLiveness" RENAME COLUMN "project_id" TO "projectId";
ALTER TABLE "AggregatedLiveness" RENAME COLUMN "updated_at" TO "updatedAt";

ALTER TABLE "Amount" RENAME COLUMN "configuration_id" TO "configurationId";

ALTER TABLE "Anomaly" RENAME COLUMN "project_id" TO "projectId";

ALTER TABLE "BlockTimestamp" RENAME COLUMN "block_number" TO "blockNumber";

ALTER TABLE "DailyDiscovery" RENAME COLUMN "project_name" TO "projectName";
ALTER TABLE "DailyDiscovery" RENAME COLUMN "chain_id" TO "chainId";
ALTER TABLE "DailyDiscovery" RENAME COLUMN "unix_timestamp" TO "timestamp";
ALTER TABLE "DailyDiscovery" RENAME COLUMN "block_number" TO "blockNumber";
ALTER TABLE "DailyDiscovery" RENAME COLUMN "config_hash" TO "configHash";
ALTER TABLE "DailyDiscovery" RENAME COLUMN "discovery_json_blob" TO "discoveryJsonBlob";

ALTER TABLE "DiscoveryCache" RENAME COLUMN "block_number" TO "blockNumber";

ALTER TABLE "Finality" RENAME COLUMN "project_id" TO "projectId";
ALTER TABLE "Finality" RENAME COLUMN "minimum_time_to_inclusion" TO "minimumTimeToInclusion";
ALTER TABLE "Finality" RENAME COLUMN "maximum_time_to_inclusion" TO "maximumTimeToInclusion";
ALTER TABLE "Finality" RENAME COLUMN "average_time_to_inclusion" TO "averageTimeToInclusion";
ALTER TABLE "Finality" RENAME COLUMN "average_state_update" TO "averageStateUpdate";

ALTER TABLE "IndexerConfiguration" RENAME COLUMN "indexer_id" TO "indexerId";
ALTER TABLE "IndexerConfiguration" RENAME COLUMN "current_height" TO "currentHeight";
ALTER TABLE "IndexerConfiguration" RENAME COLUMN "max_height" TO "maxHeight";
ALTER TABLE "IndexerConfiguration" RENAME COLUMN "min_height" TO "minHeight";

ALTER TABLE "IndexerState" RENAME COLUMN "indexer_id" TO "indexerId";
ALTER TABLE "IndexerState" RENAME COLUMN "safe_height" TO "safeHeight";
ALTER TABLE "IndexerState" RENAME COLUMN "min_timestamp" TO "minTimestamp";
ALTER TABLE "IndexerState" RENAME COLUMN "config_hash" TO "configHash";

ALTER TABLE "L2Cost" RENAME COLUMN "configuration_id" TO "configurationId";
ALTER TABLE "L2Cost" RENAME COLUMN "tx_hash" TO "txHash";
ALTER TABLE "L2Cost" RENAME COLUMN "gas_used" TO "gasUsed";
ALTER TABLE "L2Cost" RENAME COLUMN "gas_price" TO "gasPrice";
ALTER TABLE "L2Cost" RENAME COLUMN "calldata_gas_used" TO "calldataGasUsed";
ALTER TABLE "L2Cost" RENAME COLUMN "calldata_length" TO "calldataLength";
ALTER TABLE "L2Cost" RENAME COLUMN "blob_gas_used" TO "blobGasUsed";
ALTER TABLE "L2Cost" RENAME COLUMN "blob_gas_price" TO "blobGasPrice";

ALTER TABLE "L2CostPrice" RENAME COLUMN "price_usd" TO "priceUsd";

ALTER TABLE "Liveness" RENAME COLUMN "block_number" TO "blockNumber";
ALTER TABLE "Liveness" RENAME COLUMN "tx_hash" TO "txHash";
ALTER TABLE "Liveness" RENAME COLUMN "configuration_id" TO "configurationId";

ALTER TABLE "Price" RENAME COLUMN "price_usd" TO "priceUsd";
ALTER TABLE "Price" RENAME COLUMN "configuration_id" TO "configurationId";

ALTER TABLE "TvlCleaner" RENAME COLUMN "repository_name" TO "repositoryName";
ALTER TABLE "TvlCleaner" RENAME COLUMN "hourly_cleaned_until" TO "hourlyCleanedUntil";
ALTER TABLE "TvlCleaner" RENAME COLUMN "six_hourly_cleaned_until" TO "sixHourlyCleanedUntil";

ALTER TABLE "UpdateMonitor" RENAME COLUMN "project_name" TO "projectName";
ALTER TABLE "UpdateMonitor" RENAME COLUMN "block_number" TO "blockNumber";
ALTER TABLE "UpdateMonitor" RENAME COLUMN "unix_timestamp" TO "timestamp";
ALTER TABLE "UpdateMonitor" RENAME COLUMN "discovery_json_blob" TO "discoveryJsonBlob";
ALTER TABLE "UpdateMonitor" RENAME COLUMN "config_hash" TO "configHash";
ALTER TABLE "UpdateMonitor" RENAME COLUMN "chain_id" TO "chainId";

ALTER TABLE "UpdateNotifier" RENAME COLUMN "created_at" TO "createdAt";
ALTER TABLE "UpdateNotifier" RENAME COLUMN "updated_at" TO "updatedAt";
ALTER TABLE "UpdateNotifier" RENAME COLUMN "project_name" TO "projectName";
ALTER TABLE "UpdateNotifier" RENAME COLUMN "block_number" TO "blockNumber";
ALTER TABLE "UpdateNotifier" RENAME COLUMN "diff_json_blob" TO "diffJsonBlob";
ALTER TABLE "UpdateNotifier" RENAME COLUMN "chain_id" TO "chainId";

ALTER TABLE "Value" RENAME COLUMN "project_id" TO "projectId";
ALTER TABLE "Value" RENAME COLUMN "data_source" TO "dataSource";
ALTER TABLE "Value" RENAME COLUMN "external_associated" TO "externalAssociated";
ALTER TABLE "Value" RENAME COLUMN "external_for_total" TO "externalForTotal";
ALTER TABLE "Value" RENAME COLUMN "external_associated_for_total" TO "externalAssociatedForTotal";
ALTER TABLE "Value" RENAME COLUMN "canonical_associated" TO "canonicalAssociated";
ALTER TABLE "Value" RENAME COLUMN "canonical_for_total" TO "canonicalForTotal";
ALTER TABLE "Value" RENAME COLUMN "canonical_associated_for_total" TO "canonicalAssociatedForTotal";
ALTER TABLE "Value" RENAME COLUMN "native_associated" TO "nativeAssociated";
ALTER TABLE "Value" RENAME COLUMN "native_for_total" TO "nativeForTotal";
ALTER TABLE "Value" RENAME COLUMN "native_associated_for_total" TO "nativeAssociatedForTotal";

ALTER TABLE "VerifierStatus" RENAME COLUMN "chain_id" TO "chainId";
ALTER TABLE "VerifierStatus" RENAME COLUMN "last_used" TO "lastUsed";
ALTER TABLE "VerifierStatus" RENAME COLUMN "last_updated" TO "lastUpdated";

-- Rename indexes
ALTER INDEX "aggregated_l2_costs_project_id_index" RENAME TO "AggregatedL2Cost_projectId_idx";
ALTER INDEX "aggregated_l2_costs_timestamp_index" RENAME TO "AggregatedL2Cost_timestamp_idx";

ALTER INDEX "indexer_configurations_indexer_id_index" RENAME TO "IndexerConfiguration_indexerId_idx";

ALTER INDEX "update_notifier_block_number_index" RENAME TO "UpdateNotifier_blockNumber_idx";
ALTER INDEX "update_notifier_project_name_index" RENAME TO "UpdateNotifier_projectName_idx";
