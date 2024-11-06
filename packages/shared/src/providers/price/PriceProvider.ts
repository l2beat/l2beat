import { CoingeckoId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { CoingeckoQueryService, QueryResultPoint } from '../../services'

export class PriceProvider {
  constructor(private readonly client: CoingeckoQueryService) {}

  async getUsdPriceHistoryHourly(
    coingeckoId: CoingeckoId,
    from: UnixTime,
    to: UnixTime,
    address?: EthereumAddress,
  ): Promise<QueryResultPoint[]> {
    return await this.client.getUsdPriceHistoryHourly(
      coingeckoId,
      from,
      to,
      address,
    )
  }

  getAdjustedTo(from: number, to: number): UnixTime {
    return CoingeckoQueryService.getAdjustedTo(
      new UnixTime(from),
      new UnixTime(to),
    )
  }
}
