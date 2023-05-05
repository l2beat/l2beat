export {}

declare module 'knex/types/tables' {
  interface BlockNumberRow {
    unix_timestamp: Date
    block_number: number
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
  }

  interface ReportRow {
    unix_timestamp: Date
    project_id: string
    asset_id: string
    balance: string
    balance_usd: string
    balance_eth: string
  }

  interface AggregateReportRow {
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
  }

  interface BalanceStatusRow {
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
  }

  interface Tables {
    block_numbers: BlockNumberRow
    coingecko_prices: PriceRow
    asset_balances: BalanceRow
    balance_status: BalanceStatusRow
    reports: ReportRow
    aggregate_reports: AggregateReportRow
    report_status: ReportStatusRow
    sequence_processor: SequenceProcessorRow
    'activity.zksync': ZksyncTransactionRow
    'activity.block': BlockTransactionCountRow
    'activity.starkex': StarkexTransactionCountRow
    'activity.daily_count_view': DailyTransactionCountRow
    update_monitor: UpdateMonitorRow
  }
}

// Some aggregations return not empty row with null values. Use this type to explicitly type them.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NullableDict<T = any> = Record<string, T | null>
