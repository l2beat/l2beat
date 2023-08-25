import { CoingeckoClient } from '@l2beat/shared'
import { ChainId, UnixTime } from '@l2beat/shared-pure'

import { CirculatingSupplyRecord } from '../../../peripherals/database/CirculatingSupplyRepository'
import {
  CirculatingSupplyProvider,
  CirculatingSupplyQuery,
} from '../CirculatingSupplyProvider'

export class CoingeckoCirculatingSupplyProvider
  implements CirculatingSupplyProvider
{
  constructor(
    private readonly coingeckoClient: CoingeckoClient,
    private readonly chainId: ChainId,
  ) {}

  public async getCirculatingSupplies(
    totalSupplyQueries: CirculatingSupplyQuery[],
    timestamp: UnixTime,
  ): Promise<CirculatingSupplyRecord[]> {
    const from = timestamp.add(-1, 'days')
    const to = timestamp.add(1, 'days')

    const marketChart = await Promise.all(
      totalSupplyQueries.map((q) =>
        this.coingeckoClient.getCoinMarketChartRange(
          q.coingeckoId,
          'usd',
          from,
          to,
          q.address,
        ),
      ),
    )

    console.log(marketChart)

    return new Promise<CirculatingSupplyRecord[]>(() => {
      return []
    })
  }

  public getChainId(): ChainId {
    return this.chainId
  }
}
