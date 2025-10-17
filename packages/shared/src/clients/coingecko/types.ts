import { CoingeckoId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

export type CoinListEntry = v.infer<typeof CoinListEntry>
export const CoinListEntry = v.object({
  id: v.string().transform((x) => (x ? CoingeckoId(x) : undefined)),
  symbol: v.string(),
  name: v.string(),
})

export type CoinListPlatformEntry = v.infer<typeof CoinListPlatformEntry>
export const CoinListPlatformEntry = v.object({
  id: v.string().transform((x) => (x ? CoingeckoId(x) : undefined)),
  symbol: v.string(),
  name: v.string(),
  platforms: v.record(v.string(), v.union([v.string(), v.null()])),
})

export const CoinListResult = v.array(CoinListEntry)
export const CoinListPlatformResult = v.array(CoinListPlatformEntry)

export const CoinMetadata = v.object({
  image: v.object({
    thumb: v.string(),
    small: v.string(),
    large: v.string(),
  }),
})

const NumberOrString = v.union([v.number(), v.string().transform(Number)])

export type CoinMarketChartRangeResult = v.infer<
  typeof CoinMarketChartRangeResult
>
export const CoinMarketChartRangeResult = v.object({
  prices: v.array(v.tuple([NumberOrString, NumberOrString])),
  market_caps: v.array(v.tuple([NumberOrString, NumberOrString])),
  total_volumes: v.array(v.tuple([NumberOrString, NumberOrString])),
})

export interface CoinMarketChartRangeData {
  prices: { date: Date; value: number }[]
  marketCaps: { date: Date; value: number }[]
}

export const CoinsMarketResult = v.object({
  id: v.string(),
  symbol: v.string(),
  name: v.string(),
  image: v.string(),
  current_price: v.union([v.number(), v.null()]),
  circulating_supply: v.union([v.number(), v.null()]),
})

export const CoinsMarketResultData = v.array(CoinsMarketResult)
export type CoinsMarketResultData = v.infer<typeof CoinsMarketResultData>

export type CoingeckoError = v.infer<typeof CoingeckoError>
export const CoingeckoError = v.object({
  error: v.string(),
})

export type CoinData = v.infer<typeof CoinData>
export const CoinData = v.object({
  id: v.string(),
  market_data: v.object({
    current_price: v.object({
      usd: v.number(),
    }),
    market_cap: v.object({
      usd: v.number(),
    }),
    circulating_supply: v.number(),
  }),
  last_updated: v
    .string()
    .transform((date) => UnixTime.fromDate(new Date(date))),
})

export type CoinHistoricalData = v.infer<typeof CoinHistoricalData>
export const CoinHistoricalData = v.object({
  id: v.string(),
  market_data: v.object({
    current_price: v.object({
      usd: v.number(),
    }),
    market_cap: v.object({
      usd: v.number(),
    }),
  }),
})
