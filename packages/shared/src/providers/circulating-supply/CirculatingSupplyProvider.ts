import { type CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { CoingeckoQueryService, type QueryResultPoint } from '../../services'

export class CirculatingSupplyProvider {
  constructor(private readonly client: CoingeckoQueryService) {}

  async getCirculatingSupplies(
    coingeckoId: CoingeckoId,
    range: { from: UnixTime; to: UnixTime },
  ): Promise<QueryResultPoint[]> {
    return await this.client.getCirculatingSupplies(coingeckoId, range)
  }

  async getLatestCirculatingSupplies(
    tokens: CoingeckoId[],
  ): Promise<Map<string, { circulating: number }>> {
    return await this.client.getLatestMarketData(tokens)
  }

  getAdjustedTo(from: number, to: number): UnixTime {
    return CoingeckoQueryService.calculateAdjustedTo(
      UnixTime(from),
      UnixTime(to),
    )
  }
}
