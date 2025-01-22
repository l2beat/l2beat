import { tokenList } from '@l2beat/config'
import type { CoingeckoQueryService } from '@l2beat/shared'
import { assert, CoingeckoId, type UnixTime } from '@l2beat/shared-pure'
import { tickerToCoingeckoId } from './tickerToCoingeckoId'

export class PriceProvider {
  constructor(private readonly client: CoingeckoQueryService) {}

  async getPrice(ticker: string, timestamp: UnixTime): Promise<number> {
    const coingeckoId = tickerToCoingeckoId(ticker, tokenList)

    const prices = await this.client.getUsdPriceHistoryHourly(
      CoingeckoId(coingeckoId),
      timestamp,
      timestamp,
    )
    assert(
      prices.length === 1,
      `${ticker}: Too many prices fetched ${JSON.stringify(prices)}`,
    )

    return prices[0].value
  }
}
