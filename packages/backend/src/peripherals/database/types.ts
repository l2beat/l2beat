import { AmountRow } from '../../modules/tvl/repositories/AmountRepository'

export {}

import { BlockTimestampRow } from '../../modules/tvl/repositories/BlockTimestampRepository'
import { PriceRow } from '../../modules/tvl/repositories/PriceRepository'
import { ValueRow } from '../../modules/tvl/repositories/ValueRepository'
import { IndexerConfigurationRow } from '../../tools/uif/IndexerConfigurationRepository'
import { IndexerStateRow } from '../../tools/uif/IndexerStateRepository'

declare module 'knex/types/tables' {
  interface SequenceProcessorRow {
    id: string
    last_processed: number
    latest: number
    synced_once: boolean
    updated_at: Date
  }

  interface ZksyncTransactionRow {
    block_number: number
    block_index: number
    unix_timestamp: Date
  }

  interface BlockTransactionCountRow {
    unix_timestamp: Date
    project_id: string
    block_number: number
    count: number
  }

  interface StarkexTransactionCountRow {
    unix_timestamp: Date
    project_id: string
    count: number
  }

  interface DailyTransactionCountRow {
    project_id: string
    count: string // postgres keeps it as bigint, because it is a sum of integers
    unix_timestamp: Date
  }

  type ProjectsAggregatedDailyCountRow = Omit<
    DailyTransactionCountRow,
    'project_id'
  >

  interface UpdateMonitorRow {
    project_name: string
    chain_id: number
    block_number: number
    unix_timestamp: Date
    discovery_json_blob: string
    config_hash: string
    version: number
  }

  interface DiscoveryHistoryRow {
    project_name: string
    chain_id: number
    block_number: number
    unix_timestamp: Date
    discovery_json_blob: string
    config_hash: string
    version: number
  }

  interface UpdateNotifierRow {
    id: number
    created_at: Date
    updated_at: Date
    project_name: string
    block_number: number
    diff_json_blob: string
    chain_id: number
  }

  interface LivenessRow {
    timestamp: Date
    block_number: number
    tx_hash: string
    tracked_tx_id: string
  }

  interface FinalityRow {
    project_id: string
    timestamp: Date
    minimum_time_to_inclusion: number
    maximum_time_to_inclusion: number
    average_time_to_inclusion: number

    average_state_update: number | null
  }

  interface TrackedTxsConfigRow {
    id: string
    project_id: string
    type: string
    subtype: string | null
    debug_info: string
    since_timestamp_inclusive: Date
    until_timestamp_exclusive: Date | null
    last_synced_timestamp: Date | null
  }

  interface L2CostsRow {
    tracked_tx_id: string
    tx_hash: string
    timestamp: Date
    gas_used: number
    gas_price: string
    calldata_length: number
    calldata_gas_used: number
    blob_gas_used: number | null
    blob_gas_price: string | null
  }

  interface AggregatedL2CostsRow {
    timestamp: Date
    project_id: string
    total_gas: number
    total_gas_eth: number
    total_gas_usd: number
    blobs_gas: number | null
    blobs_gas_eth: number | null
    blobs_gas_usd: number | null
    calldata_gas: number
    calldata_gas_eth: number
    calldata_gas_usd: number
    compute_gas: number
    compute_gas_eth: number
    compute_gas_usd: number
    overhead_gas: number
    overhead_gas_eth: number
    overhead_gas_usd: number
  }

  interface L2CostsPricesRow {
    timestamp: Date
    price_usd: number
  }

  interface DiscoveryCacheRow {
    key: string
    value: string
    chain: string
    block_number: number
  }

  interface TvlCleanerRow {
    repository_name: string
    hourly_cleaned_until: Date
    six_hourly_cleaned_until: Date
  }

  interface VerifierStatusRow {
    address: string
    chain_id: number
    last_used: Date
    last_updated: Date
  }

  export interface AggregatedLivenessRow {
    project_id: string
    subtype: string
    range: string
    min: number
    avg: number
    max: number
    timestamp: Date
  }

  export interface AnomaliesRow {
    timestamp: Date
    project_id: string
    subtype: string
    duration: number
  }

  interface Tables {
    sequence_processor: SequenceProcessorRow
    'activity.zksync': ZksyncTransactionRow
    'activity.block': BlockTransactionCountRow
    'activity.starkex': StarkexTransactionCountRow
    'activity.daily_count_view': DailyTransactionCountRow
    update_monitor: UpdateMonitorRow
    update_notifier: UpdateNotifierRow
    liveness: LivenessRow
    discovery_cache: DiscoveryCacheRow
    daily_discovery: DiscoveryHistoryRow
    indexer_state: IndexerStateRow
    tvl_cleaner: TvlCleanerRow
    finality: FinalityRow
    tracked_txs_configs: TrackedTxsConfigRow
    l2_costs: L2CostsRow
    l2_costs_prices: L2CostsPricesRow
    aggregated_l2_costs: AggregatedL2CostsRow
    prices: PriceRow
    block_timestamps: BlockTimestampRow
    amounts: AmountRow
    indexer_configurations: IndexerConfigurationRow
    values: ValueRow
    verifier_state: VerifierStatusRow
    aggregated_liveness: AggregatedLivenessRow
  }
}

// Some aggregations return not empty row with null values. Use this type to explicitly type them.
// biome-ignore lint/suspicious/noExplicitAny: generic type
export type NullableDict<T = any> = Record<string, T | null>
