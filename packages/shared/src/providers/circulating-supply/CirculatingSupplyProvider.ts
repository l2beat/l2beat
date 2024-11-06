import { CoingeckoId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { CoingeckoQueryService, QueryResultPoint } from '../../services'

export class CirculatingSupplyProvider {
  constructor(private readonly client: CoingeckoQueryService) {}

  async getCirculatingSupplies(
    coingeckoId: CoingeckoId,
    range: { from: UnixTime; to: UnixTime },
    address?: EthereumAddress,
  ): Promise<QueryResultPoint[]> {
    return await this.client.getCirculatingSupplies(coingeckoId, range, address)
  }

  getAdjustedTo(from: number, to: number): UnixTime {
    return CoingeckoQueryService.getAdjustedTo(
      new UnixTime(from),
      new UnixTime(to),
    )
  }
}
