import z from 'zod'

import { AssetId } from './AssetId'
import { branded } from './branded'
import { UnixTime } from './UnixTime'

const MainChartPoint = z.tuple([
  branded(z.number(), (n) => new UnixTime(n)),
  z.number(),
  z.number(),
])
export type MainChartPoint = z.infer<typeof MainChartPoint>

const MainChart = z.object({
  types: z.tuple([z.literal('timestamp'), z.string(), z.string()]),
  data: z.array(MainChartPoint),
})
export type MainChart = z.infer<typeof MainChart>

export const MainCharts = z.object({
  hourly: MainChart,
  sixHourly: MainChart,
  daily: MainChart,
})
export type MainCharts = z.infer<typeof MainCharts>

export const MainToken = z.object({
  assetId: branded(z.string(), AssetId),
  tvl: z.number(),
})
export type MainToken = z.infer<typeof MainToken>

export const MainProject = z.object({
  tokens: z.array(MainToken),
  charts: MainCharts,
})
export type MainProject = z.infer<typeof MainProject>

export const ApiMain = z.object({
  bridges: MainCharts,
  layers2s: MainCharts,
  combined: MainCharts,
  projects: z.record(z.string(), MainProject.optional()),
})
export type ApiMain = z.infer<typeof ApiMain>
