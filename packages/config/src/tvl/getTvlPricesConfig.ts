import { PriceConfigEntry, UnixTime, assert } from '@l2beat/shared-pure'
import { tokenList } from '../tokens'
import { chains } from '../chains'

export function getTvlPricesConfig(
  minTimestampOverride?: UnixTime,
): PriceConfigEntry[] {
  const prices = new Map<string, PriceConfigEntry>()

  for (const token of tokenList) {
    const chain = chains.find((x) => x.chainId === +token.chainId)
    assert(chain, `Chain not found for token ${token.id}`)

    const key = `${chain.name}-${(token.address ?? 'native').toString()}`

    assert(prices.get(key) === undefined, 'Every price should be unique')

    assert(chain.minTimestampForTvl, 'Chain should have minTimestampForTvl')
    const chainMinTimestamp = UnixTime.max(
      chain.minTimestampForTvl,
      minTimestampOverride ?? new UnixTime(0),
    )
    const sinceTimestamp = UnixTime.max(chainMinTimestamp, token.sinceTimestamp)

    prices.set(key, {
      type: 'coingecko',
      assetId: token.id,
      address: token.address ?? 'native',
      chain: chain.name,
      sinceTimestamp,
      coingeckoId: token.coingeckoId,
    })
  }

  return Array.from(prices.values())
}
