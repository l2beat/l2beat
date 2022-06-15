import { ReportOutput } from '../../api/controllers/report/generateReportOutput'

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
    block_number: number
    unix_timestamp?: string
    holder_address: string
    asset_id: string
    balance: string
  }

  interface ReportRow {
    block_number: number
    unix_timestamp: string
    bridge_address: string
    asset_id: string
    balance: string
    usd_tvl: string
    eth_tvl: string
    is_daily: boolean
  }

  interface ProjectAssetBalanceRow {
    unix_timestamp: string
    project_id: string
    asset_id: string
    balance: string
    balance_usd: string
    balance_eth: string
  }

  interface ProjectBalanceRow {
    unix_timestamp: string
    project_id: string
    usd_tvl: string
    eth_tvl: string
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
    project_asset_balances: ProjectAssetBalanceRow
    project_balances: ProjectBalanceRow
  }
}
