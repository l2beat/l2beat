import type { CoingeckoQueryService } from '@l2beat/shared'
import { assert, CoingeckoId, type UnixTime } from '@l2beat/shared-pure'

export class CirculatingSupplyProvider {
  constructor(private readonly client: CoingeckoQueryService) {}

  async getCirculatingSupply(
    priceId: string,
    timestamp: UnixTime,
  ): Promise<number> {
    const supplies = await this.client.getCirculatingSupplies(
      CoingeckoId(priceId),

      { from: timestamp, to: timestamp },
    )
    assert(
      supplies.length === 1,
      `${priceId}: Too many supplies fetched ${JSON.stringify(supplies)}`,
    )

    return supplies[0].value
  }

  async getLatestCirculatingSupplies(
    priceIds: string[],
  ): Promise<Map<string, number>> {
    const coingeckoIds = priceIds.map((priceId) => CoingeckoId(priceId))

    const latestMarketData = await this.client.getLatestMarketData(coingeckoIds)

    const result = new Map<string, number>()

    for (const priceId of priceIds) {
      const data = latestMarketData.get(CoingeckoId(priceId))
      assert(data !== undefined, `${priceId}: Price not found`)
      result.set(priceId, data.circulating)
    }

    return result
  }
}
