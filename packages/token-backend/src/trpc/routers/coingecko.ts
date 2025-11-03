import { CoingeckoClient, HttpClient } from '@l2beat/shared'
import { CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { config } from '../../config'
import { getLogger } from '../../logger'
import { protectedProcedure, router } from '../trpc'

const httpClient = new HttpClient()
const coingeckoClient = new CoingeckoClient({
  apiKey: config.coingeckoApiKey,
  http: httpClient,
  logger: getLogger(),
  sourceName: 'coingecko',
  callsPerMinute: 400,
  retryStrategy: 'RELIABLE',
})

export const coingeckoRouter = router({
  getCoinById: protectedProcedure.input(v.string()).query(({ input }) => {
    return coingeckoClient.getCoinDataById(CoingeckoId(input))
  }),
  getListingTimestamp: protectedProcedure
    .input(v.string())
    .query(async ({ input }) => {
      const data = await coingeckoClient.getCoinMarketChartRange(
        CoingeckoId(input),
        'usd',
        UnixTime.fromDate(new Date('2000-01-01')),
        UnixTime.now(),
      )

      const [firstPrice] = data.prices

      if (!firstPrice) {
        return null
      }

      return UnixTime.fromDate(firstPrice.date)
    }),
})
