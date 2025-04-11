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
  ): Promise<Map<string, { price: number }>> {
    return await this.client.getLatestMarketData(coingeckoIds)
  }

  getAdjustedTo(from: number, to: number): UnixTime {
    return CoingeckoQueryService.calculateAdjustedTo(
      UnixTime(from),
      UnixTime(to),
    )
  }
}
