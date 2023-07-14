export {}

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
    asset_type: string
    chain_id: number
    asset_amount: string
    usd_value: string
    eth_value: string
  }

  interface AggregatedReportRow {
    unix_timestamp: Date
    project_id: string
    tvl_usd: string
    tvl_eth: string
    is_daily: boolean
    is_six_hourly: boolean
  }

  interface ReportStatusRow {
    config_hash: string
    unix_timestamp: Date
    chain_id: number
    asset_type: string
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

  interface UpdateMonitorRow {
    project_name: string
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
  }
}

// Some aggregations return not empty row with null values. Use this type to explicitly type them.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NullableDict<T = any> = Record<string, T | null>
