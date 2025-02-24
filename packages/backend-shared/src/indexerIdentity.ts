import type {
  AggLayerL2Token,
  AggLayerNativeEtherPreminted,
  AggLayerNativeEtherWrapped,
  CoingeckoId,
  CoingeckoPriceConfigEntry,
  ElasticChainEther,
  ElasticChainL2Token,
  EscrowEntry,
  EthereumAddress,
  TotalSupplyEntry,
} from '@l2beat/shared-pure'

/**
 * This whole file is a pack of common utilities extracted from backend - it enables the frontend
 * to query the data in status-aware fashion. Most notably TVL before aggregation.
 */

export type MultiIndexerEntry =
  | TotalSupplyEntry
  | EscrowEntry
  | CoingeckoPriceConfigEntry
  | AggLayerL2Token
  | AggLayerNativeEtherPreminted
  | AggLayerNativeEtherWrapped
  | ElasticChainL2Token
  | ElasticChainEther

export function createIndexerId(name: string, tag: string | undefined) {
  return tag === undefined ? name : `${name}::${tag}`
}

export function createIndexerTag(
  chain: string,
  address: EthereumAddress | 'native',
) {
  return `${chain}_${address}`
}

export const INDEXER_NAMES = {
  CIRCULATING_SUPPLY: 'circulating_supply_indexer',
  CHAIN_AMOUNT: 'chain_amount_indexer',
  PREMINTED: 'preminted_indexer',
  PRICE: 'price_indexer',
  AGGLAYER: 'agglayer_indexer',
  ELASTIC_CHAIN: 'elastic_chain_indexer',
  DA: 'da_indexer',
}

export function getPremintedIndexerId(
  chain: string,
  address: EthereumAddress | 'native',
) {
  return createIndexerId(
    INDEXER_NAMES.PREMINTED,
    createIndexerTag(chain, address),
  )
}

export function toIndexerId(config: MultiIndexerEntry) {
  switch (config.type) {
    case 'coingecko':
      return getPriceIndexerId(config.coingeckoId)
    case 'escrow':
    case 'totalSupply':
      return getChainAmountIndexerId(config.chain)
    case 'aggLayerL2Token':
    case 'aggLayerNativeEtherPreminted':
    case 'aggLayerNativeEtherWrapped':
      return getAggLayerIndexerId(config.chain)
    case 'elasticChainL2Token':
    case 'elasticChainEther':
      return getElasticChainIndexerId(config.chain)
  }
}

export function getPriceIndexerId(coingeckoId: CoingeckoId) {
  return createIndexerId(INDEXER_NAMES.PRICE, coingeckoId.toString())
}

export function getChainAmountIndexerId(chain: string) {
  return createIndexerId(INDEXER_NAMES.CHAIN_AMOUNT, chain)
}

export function getAggLayerIndexerId(chain: string) {
  return createIndexerId(INDEXER_NAMES.AGGLAYER, chain)
}

export function getElasticChainIndexerId(chain: string) {
  return createIndexerId(INDEXER_NAMES.ELASTIC_CHAIN, chain)
}

export function getCirculatingSupplyIndexerId(coingeckoId: CoingeckoId) {
  return createIndexerId(
    INDEXER_NAMES.CIRCULATING_SUPPLY,
    coingeckoId.toString(),
  )
}
