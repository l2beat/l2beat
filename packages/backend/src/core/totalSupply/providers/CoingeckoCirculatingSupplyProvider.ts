import { CoingeckoClient, Logger } from '@l2beat/shared'
import { assert, ChainId, UnixTime } from '@l2beat/shared-pure'
import { minBy } from 'lodash'

import { CirculatingSupplyRecord } from '../../../peripherals/database/CirculatingSupplyRepository'
import { promiseAllPlus } from '../../queue/promiseAllPlus'
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
    const from = timestamp.add(-2, 'days')
    const to = timestamp.add(2, 'days')

    const responses = await promiseAllPlus(
      totalSupplyQueries.map((q) => async () => {
        const chart = await this.coingeckoClient.getCoinMarketChartRange(
          q.coingeckoId,
          'usd',
          from,
          to,
          q.address,
        )

        return {
          assetId: q.assetId,
          decimals: q.decimals,
          chart,
        }
      }),
      Logger.SILENT,
      { metricsId: CoingeckoCirculatingSupplyProvider.name },
    )

    const circulatingSupplies: CirculatingSupplyRecord[] = responses.map(
      ({ decimals, assetId, chart }) => {
        const marketCapDiffed = chart.marketCaps.map(({ marketCap, date }) => ({
          marketCap,
          dateDiff: Math.abs(date.getTime() / 1000 - timestamp.toNumber()),
        }))
        const pricesDiffed = chart.prices.map(({ price, date }) => ({
          price,
          dateDiff: Math.abs(date.getTime() / 1000 - timestamp.toNumber()),
        }))

        const marketCap = minBy(marketCapDiffed, (e) => e.dateDiff)
        const price = minBy(pricesDiffed, (e) => e.dateDiff)
        assert(marketCap && price)

        const circulatingSupply = Math.floor(
          (marketCap.marketCap / price.price) * Math.pow(10, decimals),
        )

        return {
          timestamp,
          circulatingSupply: BigInt(circulatingSupply),
          assetId,
          chainId: this.chainId,
        }
      },
    )

    return circulatingSupplies
  }

  public getChainId(): ChainId {
    return this.chainId
  }
}
