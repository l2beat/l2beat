import { tokenList } from '@l2beat/config'
import type { CoingeckoQueryService } from '@l2beat/shared'
import { assert, CoingeckoId, type UnixTime } from '@l2beat/shared-pure'
import { tickerToCoingeckoId } from './tickers'

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

  async getLatestPrices(tickers: string[]): Promise<Map<string, number>> {
    const coingeckoIds = tickers.map((ticker) =>
      CoingeckoId(tickerToCoingeckoId(ticker, tokenList)),
    )

    const latestMarketData = await this.client.getLatestMarketData(coingeckoIds)

    const result = new Map<string, number>()

    for (const ticker of tickers) {
      const data = latestMarketData.get(
        CoingeckoId(tickerToCoingeckoId(ticker, tokenList)),
      )
      assert(data !== undefined, `${ticker}: Price not found`)
      result.set(ticker, data.price)
    }

    return result
  }
}
