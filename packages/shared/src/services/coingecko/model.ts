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

export type CoinMarketChartRangeResult = z.infer<
  typeof CoinMarketChartRangeResult
>
export const CoinMarketChartRangeResult = z.object({
  prices: z.array(z.tuple([z.number(), z.number()])),
  market_caps: z.array(z.tuple([z.number(), z.number()])),
  total_volumes: z.array(z.tuple([z.number(), z.number()])),
})

export interface CoinMarketChartRangeData {
  prices: { date: Date; price: number }[]
  marketCaps: { date: Date; marketCap: number }[]
  totalVolumes: { date: Date; totalVolume: number }[]
}
