import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { config } from '../../config'
import { getUrlWithParams } from '../../utils/getUrlWithParams'
import { protectedProcedure, router } from '../trpc'

export type Coin = v.infer<typeof CoinSchema>
const CoinSchema = v.object({
  id: v.string(),
  image: v.object({
    large: v.string(),
  }),
})

const HistoricalChartSchema = v.object({
  prices: v.array(v.tuple([v.number(), v.number()])),
})

export const coingeckoRouter = router({
  getCoinById: protectedProcedure.input(v.string()).query(async ({ input }) => {
    try {
      const url = getUrlWithParams(
        `https://pro-api.coingecko.com/api/v3/coins/${input}`,
        {
          localization: 'false',
          tickers: 'false',
          market_data: 'false',
          community_data: 'false',
          developer_data: 'false',
          sparkline: 'false',
        },
      )
      const options = {
        method: 'GET',
        headers: {
          'x-cg-pro-api-key': config.coingeckoApiKey,
        },
      }
      const response = await fetch(url, options)
      const data = await response.json()
      return CoinSchema.parse(data)
    } catch {
      return null
    }
  }),
  getListingTimestamp: protectedProcedure
    .input(v.string())
    .query(async ({ input }) => {
      try {
        const url = getUrlWithParams(
          `https://pro-api.coingecko.com/api/v3/coins/${input}/market_chart/range`,
          {
            vs_currency: 'usd',
            from: '2000-01-01',
            to: UnixTime.toYYYYMMDD(UnixTime.fromDate(new Date())),
            precision: '0',
          },
        )
        const options = {
          method: 'GET',
          headers: {
            'x-cg-pro-api-key': config.coingeckoApiKey,
          },
        }
        const response = await fetch(url, options)
        const data = await response.json()
        const parsed = HistoricalChartSchema.parse(data)
        const [firstPrice] = parsed.prices

        if (!firstPrice) {
          return null
        }

        return UnixTime(Math.floor(firstPrice[0] / 1000))
      } catch {
        return null
      }
    }),
})
