import { v } from '@l2beat/validate'

export type Coin = v.infer<typeof CoinSchema>
export const CoinSchema = v.object({
  id: v.string(),
  image: v.object({
    large: v.string(),
  }),
})

export type CoinListEntry = v.infer<typeof CoinListEntrySchema>
export const CoinListEntrySchema = v.object({
  id: v.string(),
  symbol: v.string(),
  name: v.string(),
})

export type CoinListPlatformEntry = v.infer<typeof CoinListPlatformEntrySchema>
export const CoinListPlatformEntrySchema = v.object({
  id: v.string(),
  symbol: v.string(),
  name: v.string(),
  platforms: v.record(v.string(), v.union([v.string(), v.null()])),
})

export const CoinMarketChartRangeResultSchema = v.object({
  prices: v.array(v.tuple([v.number(), v.string()])),
  market_caps: v.array(v.tuple([v.number(), v.string()])),
  total_volumes: v.array(v.tuple([v.number(), v.string()])),
})

export interface CoinMarketChartRangeData {
  prices: { date: Date; value: number }[]
  marketCaps: { date: Date; value: number }[]
}

export interface CoingeckoClientConfig {
  apiKey?: string
}

