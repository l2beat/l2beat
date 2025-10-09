import { v } from '@l2beat/validate'
import { getUrlWithParams } from '~/utils/getUrlWithParams'
import { toYYYYMMDD } from '~/utils/toYYYYMMDD'

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

export const coingecko = {
  getCoinById: async (id: string) => {
    // move to BE
    try {
      const url = getUrlWithParams(
        `https://pro-api.coingecko.com/api/v3/coins/${id}`,
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
          'x-cg-pro-api-key': import.meta.env.VITE_COINGECKO_API_KEY ?? '',
        },
      }
      const response = await fetch(url, options)
      const data = await response.json()
      return CoinSchema.parse(data)
    } catch {
      return null
    }
  },

  getListingTimestamp: async (id: string) => {
    try {
      const url = getUrlWithParams(
        `https://pro-api.coingecko.com/api/v3/coins/${id}/market_chart/range`,
        {
          vs_currency: 'usd',
          from: '2000-01-01',
          to: toYYYYMMDD(new Date()),
          precision: '0',
        },
      )
      const options = {
        method: 'GET',
        headers: {
          'x-cg-pro-api-key': import.meta.env.VITE_COINGECKO_API_KEY ?? '',
        },
      }
      const response = await fetch(url, options)
      const data = await response.json()
      const parsed = HistoricalChartSchema.parse(data)
      const [firstPrice] = parsed.prices

      if (!firstPrice) {
        return null
      }

      return new Date(firstPrice[0])
    } catch {
      return null
    }
  },
}
