-- Rename Table
ALTER TABLE "activity" RENAME TO "Activity";
ALTER TABLE "Activity" RENAME CONSTRAINT "activity_pkey" TO "Activity_pkey";

-- Rename Table
ALTER TABLE "aggregated_l2_costs" RENAME TO "AggregatedL2Cost";
ALTER TABLE "AggregatedL2Cost" RENAME CONSTRAINT "aggregated_l2_costs_pkey" TO "AggregatedL2Cost_pkey";

-- Rename Table
ALTER TABLE "aggregated_liveness" RENAME TO "AggregatedLiveness";
ALTER TABLE "AggregatedLiveness" RENAME CONSTRAINT "aggregated_liveness_pkey" TO "AggregatedLiveness_pkey";

-- Rename Table
ALTER TABLE "amounts" RENAME TO "Amount";
ALTER TABLE "Amount" RENAME CONSTRAINT "amounts_pkey" TO "Amount_pkey";

-- Rename Table
ALTER TABLE "anomalies" RENAME TO "Anomaly";
ALTER TABLE "Anomaly" RENAME CONSTRAINT "anomalies_pkey" TO "Anomaly_pkey";

-- Rename Table
ALTER TABLE "block_timestamps" RENAME TO "BlockTimestamp";
ALTER TABLE "BlockTimestamp" RENAME CONSTRAINT "block_timestamps_pkey" TO "BlockTimestamp_pkey";

-- Rename Table
ALTER TABLE "daily_discovery" RENAME TO "DailyDiscovery";
ALTER TABLE "DailyDiscovery" RENAME CONSTRAINT "daily_discovery_pkey" TO "DailyDiscovery_pkey";

-- Rename Table
ALTER TABLE "discovery_cache" RENAME TO "DiscoveryCache";
ALTER TABLE "DiscoveryCache" RENAME CONSTRAINT "discovery_cache_pkey" TO "DiscoveryCache_pkey";

-- Rename Table
ALTER TABLE "finality" RENAME TO "Finality";
ALTER TABLE "Finality" RENAME CONSTRAINT "finality_pkey" TO "Finality_pkey";

-- Rename Table
ALTER TABLE "indexer_configurations" RENAME TO "IndexerConfiguration";
ALTER TABLE "IndexerConfiguration" RENAME CONSTRAINT "indexer_configurations_pkey" TO "IndexerConfiguration_pkey";

-- Rename Table
ALTER TABLE "indexer_state" RENAME TO "IndexerState";
ALTER TABLE "IndexerState" RENAME CONSTRAINT "indexer_state_pkey" TO "IndexerState_pkey";

-- Rename Table
ALTER TABLE "l2_costs" RENAME TO "L2Cost";
ALTER TABLE "L2Cost" RENAME CONSTRAINT "l2_costs_pkey" TO "L2Cost_pkey";

-- Rename Table
ALTER TABLE "l2_costs_prices" RENAME TO "L2CostPrice";
ALTER TABLE "L2CostPrice" RENAME CONSTRAINT "l2_costs_prices_pkey" TO "L2CostPrice_pkey";

-- Rename Table
ALTER TABLE "liveness" RENAME TO "Liveness";
ALTER TABLE "Liveness" RENAME CONSTRAINT "liveness_pkey" TO "Liveness_pkey";


-- Rename Table
ALTER TABLE "prices" RENAME TO "Price";
ALTER TABLE "Price" RENAME CONSTRAINT "prices_pkey" TO "Price_pkey";

-- Rename Table
ALTER TABLE "sequence_processor" RENAME TO "SequenceProcessor";
ALTER TABLE "SequenceProcessor" RENAME CONSTRAINT "sequence_processor_pkey" TO "SequenceProcessor_pkey";

-- Rename Table
ALTER TABLE "tvl_cleaner" RENAME TO "TvlCleaner";
ALTER TABLE "TvlCleaner" RENAME CONSTRAINT "tvl_cleaner_pkey" TO "TvlCleaner_pkey";

-- Rename Table
ALTER TABLE "update_monitor" RENAME TO "UpdateMonitor";
ALTER TABLE "UpdateMonitor" RENAME CONSTRAINT "update_monitor_pkey" TO "UpdateMonitor_pkey";

-- Rename Table
ALTER TABLE "update_notifier" RENAME TO "UpdateNotifier";
ALTER TABLE "UpdateNotifier" RENAME CONSTRAINT "update_notifier_pkey" TO "UpdateNotifier_pkey";

-- Rename Table
ALTER TABLE "values" RENAME TO "Value";
ALTER TABLE "Value" RENAME CONSTRAINT "values_pkey" TO "Value_pkey";

-- Rename Table
ALTER TABLE "verifier_status" RENAME TO "VerifierStatus";
ALTER TABLE "VerifierStatus" RENAME CONSTRAINT "verifier_status_pkey" TO "VerifierStatus_pkey";

