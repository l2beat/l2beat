import { tokenList } from '@l2beat/config'
import type { CoingeckoQueryService } from '@l2beat/shared'
import { assert, CoingeckoId, type UnixTime } from '@l2beat/shared-pure'
import { tickerToCoingeckoId } from './tickers'

export class CirculatingSupplyProvider {
  constructor(private readonly client: CoingeckoQueryService) {}

  async getCirculatingSupply(
    ticker: string,
    timestamp: UnixTime,
  ): Promise<number> {
    const coingeckoId = tickerToCoingeckoId(ticker, tokenList)

    const supplies = await this.client.getCirculatingSupplies(
      CoingeckoId(coingeckoId),

      { from: timestamp, to: timestamp },
    )
    assert(
      supplies.length === 1,
      `${ticker}: Too many supplies fetched ${JSON.stringify(supplies)}`,
    )

    return supplies[0].value
  }

  async getLatestCirculatingSupplies(
    tickers: string[],
  ): Promise<Map<string, number>> {
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
      result.set(ticker, data.circulating)
    }

    return result
  }
}
