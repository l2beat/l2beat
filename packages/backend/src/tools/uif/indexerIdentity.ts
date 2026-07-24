export function createIndexerId(name: string, tag: string | undefined) {
  return tag === undefined ? name : `${name}::${tag}`
}

export const INDEXER_NAMES = {
  DA: 'da_indexer',
  DA2: 'da_indexer_v2',
  // v2 stores call metadata used for Ethereum DA attribution
  BLOB: 'blob_indexer_v2',
  ECOSYSTEM_TOKEN: 'ecosystem_token_indexer',
  INTEROP_RECENT_PRICES: 'interop_recent_prices_indexer',
  // TVS
  TVS_BLOCK_TIMESTAMP: 'tvs_block_timestamp_indexer',
  TVS_CHAIN_AMOUNT: 'tvs_chain_amount_indexer',
  TVS_PRICE: 'tvs_price_indexer',
  TVS_CIRCULATING_SUPPLY: 'tvs_circulating_supply_indexer',
  TVS_TOKEN_VALUE: 'tvs_token_value',
  TVS_CLEANER: 'tvs_cleaner',
  PRIVACY_BLOCK_TIMESTAMP: 'privacy_block_timestamp_indexer',
  PRIVACY_FLOW: 'privacy_flow_indexer',
  PRIVACY_PRICE: 'privacy_price_indexer',
  PRIVACY_BUCKET_VALUE: 'privacy_bucket_value_indexer',
  ETHEREUM_BLOB_NOTIFIER: 'ethereum_blob_notifier',
  DAILY_CHECKS_NOTIFIER: 'daily_checks_notifier',
}
