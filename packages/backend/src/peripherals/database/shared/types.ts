export {}

declare module 'knex/types/tables' {
  interface BlockNumberRow {
    unix_timestamp: string
    block_number: number
  }

  interface PriceRow {
    asset_id: string
    price_usd: number
    unix_timestamp: string
  }

  interface BalanceRow {
    unix_timestamp: string
    holder_address: string
    asset_id: string
    balance: string
  }

  interface ReportRow {
    unix_timestamp: string
    project_id: string
    asset_id: string
    balance: string
    balance_usd: string
    balance_eth: string
  }

  interface AggregateReportRow {
    unix_timestamp: string
    project_id: string
    tvl_usd: string
    tvl_eth: string
    is_daily: boolean
    is_six_hourly: boolean
  }

  interface ReportStatusRow {
    config_hash: string
    unix_timestamp: string
  }

  interface BalanceStatusRow {
    config_hash: string
    unix_timestamp: string
  }

  interface BlockCountRow {
    unix_timestamp: Date
    project_id: string
    block_number: number
    count: number
  }

  interface StarkexCountRow {
    unix_timestamp: Date
    project_id: string
    count: number
  }

  interface ZksyncTransactionRow {
    block_number: number
    block_index: number
    unix_timestamp: Date
  }

  interface DailyCountRow {
    project_id: string
    count: number
    unix_timestamp: Date
  }

  interface SequenceProcessorRow {
    id: string
    tip: number
    reached_at: Date
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
    'transactions.block': BlockCountRow
    'transactions.zksync': ZksyncTransactionRow
    'transactions.starkex': StarkexCountRow
    'transactions.daily_count_view': DailyCountRow
  }
}
