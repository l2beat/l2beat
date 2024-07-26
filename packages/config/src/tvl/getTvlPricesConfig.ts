import { assert, PriceConfigEntry, UnixTime } from '@l2beat/shared-pure'
import { chains } from '../chains'
import { tokenList } from '../tokens'

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
