import { tokenList } from '@l2beat/config'
import { CoingeckoQueryService } from '@l2beat/shared'
import { assert, type Token, UnixTime } from '@l2beat/shared-pure'

export class PriceProvider {
  constructor(private readonly client: CoingeckoQueryService) {}

  async getPrice(priceId: string, timestamp: UnixTime): Promise<number> {
    const coingeckoId = priceIdToCoingeckoId(priceId, tokenList)

    const prices = await this.client.getUsdPriceHistoryHourly(
      coingeckoId,
      timestamp,
      timestamp,
    )
    assert(
      prices.length === 1,
      `${priceId}: Too many prices fetched ${JSON.stringify(prices)}`,
    )

    return prices[0].value
  }

  getAdjustedTo(from: number, to: number): UnixTime {
    return CoingeckoQueryService.calculateAdjustedTo(
      new UnixTime(from),
      new UnixTime(to),
    )
  }
}

export function priceIdToCoingeckoId(priceId: string, legacyTokens: Token[]) {
  switch (priceId) {
    case 'Ether':
      return 'ethereum'
    case 'mETH':
      return 'manta-meth'
    case 'Tether USD':
      return 'tether'
    case 'USD Coin':
      return 'usd-coin'
    case 'Wrapped BTC':
      return 'wrapped-bitcoin'
    case 'Wrapped Ether':
      return 'weth'
    case 'Wrapped SOL':
      return 'solana'
    case 'TIA':
      return 'celestia'
    case 'USDC':
      return 'usd-coin'
  }

  const coingeckoIds = legacyTokens
    .filter((t) => t.name === priceId)
    .map((t) => t.coingeckoId)

  assert(coingeckoIds.length > 0, `${priceId}: No tokens with this name found`)

  const coingeckoId = coingeckoIds[0]
  assert(
    coingeckoIds.every((id) => id === coingeckoId),
    `${priceId}: CoingeckoIds mismatch ${coingeckoIds}`,
  )
  return coingeckoId
}
