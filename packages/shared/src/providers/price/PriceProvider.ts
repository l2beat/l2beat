import { type CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { CoingeckoQueryService, type QueryResultPoint } from '../../services'

export class PriceProvider {
  constructor(private readonly client: CoingeckoQueryService) {}

  async getUsdPriceHistoryHourly(
    coingeckoId: CoingeckoId,
    from: UnixTime,
    to: UnixTime,
  ): Promise<QueryResultPoint[]> {
    return await this.client.getUsdPriceHistoryHourly(coingeckoId, from, to)
  }

  async getLatestPrices(
    coingeckoIds: CoingeckoId[],
  ): Promise<Map<string, number>> {
    const marketData = await this.client.getLatestMarketData(coingeckoIds)

    const result = new Map<string, number>()

    for (const [id, data] of marketData.entries()) {
      result.set(id, data.price)
    }

    return result
  }

  getAdjustedTo(from: number, to: number): UnixTime {
    return CoingeckoQueryService.calculateAdjustedTo(
      UnixTime(from),
      UnixTime(to),
    )
  }
}
