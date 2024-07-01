import { AssetId, ChainId, branded } from '@l2beat/shared-pure'
import { z } from 'zod'

export async function getTvl() {
  // TEMPORARY UNTIL WE SWITCH TO QUERYING DB
  const response = await fetch('https://api.l2beat.com/api/tvl', {
    next: {
      revalidate: 60 * 60,
    },
  })
  const json: unknown = await response.json()
  const data = TvlResponse.parse(json)
  return data
}

const TvlChart = z.object({
  types: z.tuple([
    z.literal('timestamp'),
    z.literal('totalUsd'),
    z.literal('canonicalUsd'),
    z.literal('externalUsd'),
    z.literal('nativeUsd'),
    z.literal('totalEth'),
    z.literal('canonicalEth'),
    z.literal('externalEth'),
    z.literal('nativeEth'),
  ]),
  data: z.array(
    z.tuple([
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
      z.number(),
    ]),
  ),
})

export type TvlCharts = z.infer<typeof TvlCharts>
export const TvlCharts = z.object({
  hourly: TvlChart,
  sixHourly: TvlChart,
  daily: TvlChart,
})

export type TvlProjectToken = z.infer<typeof TvlProjectToken>
export const TvlProjectToken = z.object({
  assetId: branded(z.string(), AssetId),
  chainId: branded(z.number(), ChainId),
  // TODO(L2B-5614): Make both required
  address: z.string().optional(),
  chain: z.string().optional(),
  source: z.string(),
  usdValue: z.number(),
})

export type TvlProject = z.infer<typeof TvlProject>
export const TvlProject = z.object({
  tokens: z.object({
    canonical: z.array(TvlProjectToken),
    external: z.array(TvlProjectToken),
    native: z.array(TvlProjectToken),
  }),
  charts: TvlCharts,
})

export type TvlResponse = z.infer<typeof TvlResponse>
export const TvlResponse = z.object({
  layers2s: TvlCharts,
  bridges: TvlCharts,
  combined: TvlCharts,
  projects: z.record(z.string(), TvlProject),
})
