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
    coingeckoIds: CoingeckoId[],
  ): Promise<Map<string, number>> {
    const marketData = await this.client.getLatestMarketData(coingeckoIds)

    const result = new Map<string, number>()

    for (const [id, data] of marketData.entries()) {
      result.set(id, data.circulating)
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
