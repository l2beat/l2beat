import { CoingeckoId } from '@l2beat/shared-pure'
import { z } from 'zod'

export type CoinListEntry = z.infer<typeof CoinListEntry>
export const CoinListEntry = z.object({
  id: z.string().transform((x) => (x ? CoingeckoId(x) : undefined)),
  symbol: z.string(),
  name: z.string(),
})

export type CoinListPlatformEntry = z.infer<typeof CoinListPlatformEntry>
export const CoinListPlatformEntry = z.object({
  id: z.string().transform((x) => (x ? CoingeckoId(x) : undefined)),
  symbol: z.string(),
  name: z.string(),
  platforms: z.record(z.string(), z.union([z.string(), z.null()])),
})

export const CoinListResult = z.array(CoinListEntry)
export const CoinListPlatformResult = z.array(CoinListPlatformEntry)

export const CoinMetadata = z.object({
  image: z.object({
    thumb: z.string(),
    small: z.string(),
    large: z.string(),
  }),
})

const NumberOrString = z.union([z.number(), z.string().transform(Number)])

export type CoinMarketChartRangeResult = z.infer<
  typeof CoinMarketChartRangeResult
>
export const CoinMarketChartRangeResult = z.object({
  prices: z.array(z.tuple([NumberOrString, NumberOrString])),
  market_caps: z.array(z.tuple([NumberOrString, NumberOrString])),
  total_volumes: z.array(z.tuple([NumberOrString, NumberOrString])),
})

export interface CoinMarketChartRangeData {
  prices: { date: Date; value: number }[]
  marketCaps: { date: Date; value: number }[]
}

export const CoinsMarketResult = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  image: z.string(),
  current_price: z.number(),
  circulating_supply: z.number(),
})

export const CoinsMarketResultData = z.array(CoinsMarketResult)
export type CoinsMarketResultData = z.infer<typeof CoinsMarketResultData>

export type CoingeckoError = z.infer<typeof CoingeckoError>
export const CoingeckoError = z.object({
  error: z.string(),
})
