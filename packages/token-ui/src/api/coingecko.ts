import { v } from '@l2beat/validate'
import { getUrlWithParams } from '~/utils/getUrlWithParams'

export type Coin = v.infer<typeof CoinSchema>
const CoinSchema = v.object({
  image: v.object({
    large: v.string(),
  }),
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
        body: undefined,
      }
      const response = await fetch(url, options)
      const data = await response.json()
      return CoinSchema.parse(data)
    } catch {
      return null
    }
  },
}
