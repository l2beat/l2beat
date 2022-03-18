export {}

declare module 'knex/types/tables' {
  interface BlockNumberRow {
    unix_timestamp: string
    block_number: number
  }

  interface PriceRow {
    coingecko_id: string
    price_usd: number
    unix_timestamp: string
  }

  interface BalanceRow {
    block_number: number
    holder_address: string
    asset_id: string
    balance: string
  }

  interface ReportRow {
    block_number: number
    unix_timestamp: string
    bridge_address: string
    asset_id: string
    usd_tvl: string
    eth_tvl: string
  }

  interface Tables {
    block_numbers: BlockNumberRow
    coingecko_prices: PriceRow
    asset_balances: BalanceRow
    reports: ReportRow
  }
}
