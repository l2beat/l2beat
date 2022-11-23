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

  interface TransactionCountViewRow {
    project_id: string
    count: number
    unix_timestamp: Date
  }

  interface BlockTipRow {
    project_id: string
    block_number: number | null
    unix_timestamp: Date | null
  }

  interface SequenceProcessorRow {
    id: string
    last_processed: number
    finished_processing_at: Date
  }

  interface DailyTransactionCountRow {
    project_id: string
    count: string // postgres keeps it as bigint, because it is a sum of integers
    unix_timestamp: Date
  }

  interface Tables {
    block_numbers: BlockNumberRow
    coingecko_prices: PriceRow
    asset_balances: BalanceRow
    balance_status: BalanceStatusRow
    reports: ReportRow
    aggregate_reports: AggregateReportRow
    report_status: ReportStatusRow
    'transactions.block': BlockTransactionCountRow
    'transactions.block_count_view': TransactionCountViewRow
    'transactions.block_tip': BlockTipRow
    'transactions.zksync': ZksyncTransactionRow
    'transactions.zksync_count_view': TransactionCountViewRow
    'transactions.starkex': StarkexTransactionCountRow
    sequence_processor: SequenceProcessorRow
    'activity_v2.block': BlockTransactionCountRow
    'activity_v2.zksync': ZksyncTransactionRow
    'activity_v2.starkex': StarkexTransactionCountRow
    'activity_v2.daily_count_view': DailyTransactionCountRow
  }
}
