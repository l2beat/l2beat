import type { CoingeckoQueryService } from '@l2beat/shared'
import { assert, CoingeckoId, type UnixTime } from '@l2beat/shared-pure'

export class PriceProvider {
  constructor(private readonly client: CoingeckoQueryService) {}

  async getPrice(priceId: string, timestamp: UnixTime): Promise<number> {
    const prices = await this.client.getUsdPriceHistoryHourly(
      CoingeckoId(priceId),
      timestamp,
      timestamp,
    )
    assert(
      prices.length === 1,
      `${priceId}: Too many prices fetched ${JSON.stringify(prices)}`,
    )

    return prices[0].value
  }

  async getLatestPrices(priceIds: string[]): Promise<Map<string, number>> {
    const coingeckoIds = priceIds.map((priceId) => CoingeckoId(priceId))

    const latestMarketData = await this.client.getLatestMarketData(coingeckoIds)

    const result = new Map<string, number>()

    for (const priceId of priceIds) {
      const data = latestMarketData.get(CoingeckoId(priceId))
      assert(data !== undefined, `${priceId}: Price not found`)
      result.set(priceId, data.price)
    }

    return result
  }
}
