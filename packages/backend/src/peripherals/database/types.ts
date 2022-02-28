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

  interface Tables {
    block_numbers: BlockNumberRow
    coingecko_prices: PriceRow
  }
}
