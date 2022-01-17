import { z } from 'zod'

import { CoingeckoId } from './CoingeckoId'

export type CoinListEntry = z.infer<typeof CoinListEntry>
export const CoinListEntry = z.object({
  id: z.string().min(1).transform(CoingeckoId),
  symbol: z.string(),
  name: z.string(),
})

export type CoinListPlatformEntry = z.infer<typeof CoinListPlatformEntry>
export const CoinListPlatformEntry = z.object({
  id: z.string().min(1).transform(CoingeckoId),
  symbol: z.string(),
  name: z.string(),
  platforms: z.record(z.string(), z.union([z.string(), z.null()])),
})

export const CoinListResult = z.array(CoinListEntry)
export const CoinListPlatformResult = z.array(CoinListPlatformEntry)

export type CoinMarketChartRangeResult = z.infer<typeof CoinMarketChartRangeResult>
export const CoinMarketChartRangeResult = z.object({
  prices: z.array(z.array(z.number()).length(2)),
  market_caps: z.array(z.array(z.number()).length(2)),
  total_volumes: z.array(z.array(z.number()).length(2)),
})

