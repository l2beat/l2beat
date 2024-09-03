import { CoingeckoId, EthereumAddress } from '@l2beat/shared-pure'

/**
 * This whole file is a pack of common utilities extracted from backend - it enables the frontend
 * to query the data in status-aware fashion. Most notably TVL before aggregation.
 */

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

export function getPriceIndexerId(coingeckoId: CoingeckoId) {
  return createIndexerId(INDEXER_NAMES.PRICE, coingeckoId.toString())
}

export function getChainAmountIndexerId(chain: string) {
  return createIndexerId(INDEXER_NAMES.CHAIN_AMOUNT, chain)
}

export function getCirculatingSupplyIndexerId(coingeckoId: CoingeckoId) {
  return createIndexerId(
    INDEXER_NAMES.CIRCULATING_SUPPLY,
    coingeckoId.toString(),
  )
}
