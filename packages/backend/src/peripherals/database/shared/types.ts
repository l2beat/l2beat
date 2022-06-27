import { ReportOutput } from '../../../api/controllers/report/generateReportOutput'

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
    is_daily: boolean
  }

  interface CachedDataRow {
    id: number
    unix_timestamp: string
    data: ReportOutput
  }

  interface Tables {
    block_numbers: BlockNumberRow
    coingecko_prices: PriceRow
    asset_balances: BalanceRow
    reports: ReportRow
    cached_data: CachedDataRow
  }
}
