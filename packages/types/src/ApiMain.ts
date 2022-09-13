import z from 'zod'

import { AssetId } from './AssetId'
import { branded } from './branded'
import { UnixTime } from './UnixTime'

const ChartPoint = z.tuple([
  branded(z.number(), (n) => new UnixTime(n)),
  z.number(),
  z.number(),
])
export type ChartPoint = z.infer<typeof ChartPoint>

const Chart = z.object({
  types: z.tuple([z.literal('timestamp'), z.string(), z.string()]),
  data: z.array(ChartPoint),
})
export type Chart = z.infer<typeof Chart>

export const Charts = z.object({
  hourly: Chart,
  sixHourly: Chart,
  daily: Chart,
})
export type Charts = z.infer<typeof Charts>

export const Token = z.object({
  assetId: branded(z.string(), AssetId),
  tvl: z.number(),
})
export type Token = z.infer<typeof Token>

export const Project = z.object({
  tokens: z.array(Token),
  charts: Charts,
})
export type Project = z.infer<typeof Project>

export const ApiMain = z.object({
  // deprecated, alias for layer2s
  charts: Charts,
  bridges: z.optional(Charts),
  layers2s: z.optional(Charts),
  combined: z.optional(Charts),
  projects: z.record(z.string(), Project.optional()),
})
export type ApiMain = z.infer<typeof ApiMain>
