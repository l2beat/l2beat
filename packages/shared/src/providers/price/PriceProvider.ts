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

  getAdjustedTo(from: number, to: number): UnixTime {
    return CoingeckoQueryService.calculateAdjustedTo(
      new UnixTime(from),
      new UnixTime(to),
    )
  }
}
