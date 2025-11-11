import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { CoingeckoClient } from '../../chains/clients/coingecko/CoingeckoClient'
import { config } from '../../config'
import { readOnlyProcedure, router } from '../trpc'

const coingeckoClient = new CoingeckoClient({
  apiKey: config.coingeckoApiKey,
})

export const coingeckoRouter = router({
  getCoinById: readOnlyProcedure.input(v.string()).query(async ({ input }) => {
    try {
      const coin = await coingeckoClient.getCoinDataById(input)
      return coin
    } catch (error) {
      console.error(error)
      return null
    }
  }),
  getListingTimestamp: readOnlyProcedure
    .input(v.string())
    .query(async ({ input }) => {
      try {
        const marketChart = await coingeckoClient.getCoinMarketChartRange(
          input,
          'usd',
          UnixTime.fromDate(new Date('2000-01-01')),
          UnixTime.fromDate(new Date()),
        )
        const [firstPrice] = marketChart.prices

        if (!firstPrice) {
          return null
        }

        return UnixTime(Math.floor(firstPrice.date.getTime() / 1000))
      } catch (error) {
        console.error(error)
        return null
      }
    }),
})
