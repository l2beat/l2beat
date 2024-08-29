import { type CoingeckoId, type EthereumAddress } from '@l2beat/shared-pure'

export function getPriceIndexerId(coingeckoId: CoingeckoId) {
  return createId('price_indexer', coingeckoId.toString())
}

export function getChainAmountIndexerId(chain: string) {
  return createId('chain_amount_indexer', chain)
}

export function getCirculatingSupplyIndexerId(coingeckoId: CoingeckoId) {
  return createId('circulating_supply_indexer', coingeckoId.toString())
}

export function getPremintedIndexerId(
  chain: string,
  address: EthereumAddress | 'native',
) {
  return createId('preminted_indexer', createTag(chain, address))
}

function createTag(chain: string, address: EthereumAddress | 'native'): string {
  return `${chain}_${address.toString()}`
}

function createId(name: string, tag: string | undefined): string {
  return tag === undefined ? name : `${name}::${tag}`
}
