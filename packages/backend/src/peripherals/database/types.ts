import { TransactionData } from '../../modules/tracked-txs/modules/l2-costs/types/TransactionData'
import { AmountRow } from '../../modules/tvl2/repositories/AmountRepository'

export {}

import { BlockTimestampRow } from '../../modules/tvl2/repositories/BlockTimestampRepository'
import { PriceRow as PriceRow2 } from '../../modules/tvl2/repositories/PriceRepository'
import { IndexerConfigurationRow } from '../../tools/uif/IndexerConfigurationRepository'

declare module 'knex/types/tables' {
  interface BlockNumberRow {
    unix_timestamp: Date
    block_number: number
    chain_id: number
  }

  interface PriceRow {
    asset_id: string
    price_usd: number
    unix_timestamp: Date
  }

  interface BalanceRow {
    unix_timestamp: Date
    holder_address: string
    asset_id: string
    balance: string
    chain_id: number
  }

  interface ReportRow {
    unix_timestamp: Date
    project_id: string
    asset_id: string
    report_type: string
    chain_id: number
    asset_amount: string
    usd_value: string
    eth_value: string
  }

  interface AggregatedReportRow {
    unix_timestamp: Date
    project_id: string
    usd_value: string
    eth_value: string
    report_type: string
  }

  interface ReportStatusRow {
    config_hash: string
    unix_timestamp: Date
    chain_id: number
    report_type: string
  }

  interface BalanceStatusRow {
    chain_id: number
    config_hash: string
    unix_timestamp: Date
  }

  interface SequenceProcessorRow {
    id: string
    last_processed: number
    latest: number
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

  interface TotalSupplyRow {
    unix_timestamp: Date
    asset_id: string
    total_supply: string
    chain_id: number
  }

  interface TotalSupplyStatusRow {
    chain_id: number
    config_hash: string
    unix_timestamp: Date
  }

  interface CirculatingSupplyRow {
    unix_timestamp: Date
    asset_id: string
    circulating_supply: string
    chain_id: number
  }

  interface CirculatingSupplyStatusRow {
    chain_id: number
    config_hash: string
    unix_timestamp: Date
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
    data: TransactionData
  }

  interface DiscoveryCacheRow {
    key: string
    value: string
    chain: string
    block_number: number
  }

  interface IndexerStateRow {
    indexer_id: string
    safe_height: number
    min_timestamp: Date | undefined
  }

  interface TvlCleanerRow {
    repository_name: string
    hourly_cleaned_until: Date
    six_hourly_cleaned_until: Date
  }

  interface Tables {
    coingecko_prices: PriceRow
    block_numbers: BlockNumberRow
    balances: BalanceRow
    balances_status: BalanceStatusRow
    reports: ReportRow
    reports_status: ReportStatusRow
    aggregated_reports: AggregatedReportRow
    aggregated_reports_status: ReportStatusRow
    sequence_processor: SequenceProcessorRow
    'activity.zksync': ZksyncTransactionRow
    'activity.block': BlockTransactionCountRow
    'activity.starkex': StarkexTransactionCountRow
    'activity.daily_count_view': DailyTransactionCountRow
    update_monitor: UpdateMonitorRow
    update_notifier: UpdateNotifierRow
    total_supplies: TotalSupplyRow
    total_supplies_status: TotalSupplyStatusRow
    circulating_supplies: CirculatingSupplyRow
    circulating_supplies_status: CirculatingSupplyStatusRow
    liveness: LivenessRow
    discovery_cache: DiscoveryCacheRow
    daily_discovery: DiscoveryHistoryRow
    indexer_state: IndexerStateRow
    tvl_cleaner: TvlCleanerRow
    finality: FinalityRow
    tracked_txs_configs: TrackedTxsConfigRow
    l2_costs: L2CostsRow
    prices: PriceRow2
    block_timestamps: BlockTimestampRow
    amounts: AmountRow
    indexer_configurations: IndexerConfigurationRow
  }
}

// Some aggregations return not empty row with null values. Use this type to explicitly type them.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NullableDict<T = any> = Record<string, T | null>
