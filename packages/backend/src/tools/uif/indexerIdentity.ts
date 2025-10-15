export function createIndexerId(name: string, tag: string | undefined) {
  return tag === undefined ? name : `${name}::${tag}`
}

export const INDEXER_NAMES = {
  DA: 'da_indexer',
  DA2: 'da_indexer_v2',
  BLOB: 'blob_indexer',
  ECOSYSTEM_TOKEN: 'ecosystem_token_indexer',
  INTEROP_RECENT_PRICES: 'interop_recent_prices_indexer',
  // TVS
  TVS_BLOCK_TIMESTAMP: 'tvs_block_timestamp_indexer',
  TVS_CHAIN_AMOUNT: 'tvs_chain_amount_indexer',
  TVS_PRICE: 'tvs_price_indexer',
  TVS_CIRCULATING_SUPPLY: 'tvs_circulating_supply_indexer',
  TVS_TOKEN_VALUE: 'tvs_token_value',
  TVS_PROJECT_VALUE: 'tvs_project_value',
}
