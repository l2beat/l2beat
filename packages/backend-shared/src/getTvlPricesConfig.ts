import type { ChainConfig } from '@l2beat/config'
import {
  assert,
  type PriceConfigEntry,
  type Token,
  type UnixTime,
} from '@l2beat/shared-pure'

export function getTvlPricesConfig(
  chains: ChainConfig[],
  tokenList: Token[],
  minTimestampOverride?: UnixTime,
): PriceConfigEntry[] {
  const prices = new Map<string, PriceConfigEntry>()

  for (const token of tokenList) {
    const chain = chains.find((x) => x.name === token.chainName)
    assert(chain, `Chain not found for token ${token.id}`)

    const key = `${chain.name}-${(token.address ?? 'native').toString()}`

    assert(prices.get(key) === undefined, 'Every price should be unique')

    assert(chain.sinceTimestamp, 'Chain should have sinceTimestamp')
    const chainMinTimestamp = Math.max(
      chain.sinceTimestamp,
      minTimestampOverride ?? 0,
    )
    const sinceTimestamp = Math.max(chainMinTimestamp, token.sinceTimestamp)

    prices.set(key, {
      type: 'coingecko',
      assetId: token.id,
      address: token.address ?? 'native',
      chain: chain.name,
      sinceTimestamp,
      coingeckoId: token.coingeckoId,
      untilTimestamp: token.untilTimestamp,
    })
  }

  return Array.from(prices.values())
}
