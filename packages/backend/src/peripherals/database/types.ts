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

  interface Tables {
    block_numbers: BlockNumberRow
    coingecko_prices: PriceRow
    asset_balances: BalanceRow
  }
}
