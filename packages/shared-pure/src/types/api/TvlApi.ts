import z from 'zod'

import { AssetId } from '../AssetId'
import { branded } from '../branded'
import { UnixTime } from '../UnixTime'

const TvlApiChartPoint = z.tuple([
  branded(z.number(), (n) => new UnixTime(n)),
  z.number(),
  z.number(),
])
export type TvlApiChartPoint = z.infer<typeof TvlApiChartPoint>

const TvlApiChart = z.object({
  types: z.tuple([z.literal('timestamp'), z.string(), z.string()]),
  data: z.array(TvlApiChartPoint),
})
export type TvlApiChart = z.infer<typeof TvlApiChart>

export const TvlApiCharts = z.object({
  hourly: TvlApiChart,
  sixHourly: TvlApiChart,
  daily: TvlApiChart,
})
export type TvlApiCharts = z.infer<typeof TvlApiCharts>

export const TvlApiToken = z.object({
  assetId: branded(z.string(), AssetId),
  tvl: z.number(),
})
export type TvlApiToken = z.infer<typeof TvlApiToken>

export const TvlApiProject = z.object({
  tokens: z.array(TvlApiToken),
  charts: TvlApiCharts,
})
export type TvlApiProject = z.infer<typeof TvlApiProject>

export const TvlApiResponse = z.object({
  bridges: TvlApiCharts,
  layers2s: TvlApiCharts,
  combined: TvlApiCharts,
  projects: z.record(z.string(), TvlApiProject.optional()),
})
export type TvlApiResponse = z.infer<typeof TvlApiResponse>
