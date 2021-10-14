export {}

declare module 'knex/types/tables' {
  interface BlockNumberRow {
    unix_timestamp: string
    block_number: number
  }

  interface ExchangePriceRow {
    block_number: number
    asset_id: string
    exchange: string
    liquidity: string
    price: string
  }

  interface AggregatePriceRow {
    block_number: number
    asset_id: string
    price_usd: string
  }

  interface Tables {
    block_numbers: BlockNumberRow
    exchange_prices: ExchangePriceRow
    aggregate_prices: AggregatePriceRow
  }
}
