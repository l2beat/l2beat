import z from 'zod'

import { AssetId } from './AssetId'
import { stringAs } from './stringAs'

const ChartPoint = z.tuple([z.number(), z.number(), z.number()]) // timestamp, usd, eth
export type ChartPoint = z.infer<typeof ChartPoint>

const Chart = z.array(ChartPoint)
export type Chart = z.infer<typeof Chart>

export const Charts = z.object({
  hourly: Chart,
  qh6: Chart,
  daily: Chart,
})
export type Charts = z.infer<typeof Charts>

export const Token = z.object({
  assetId: stringAs(AssetId),
  tvl: z.number(),
})
export type Token = z.infer<typeof Token>

export const Project = z.object({
  tokens: z.array(Token),
  charts: Charts,
})
export type Project = z.infer<typeof Project>

export const ApiMain = z.object({
  charts: Charts,
  projects: z.record(z.string(), Project),
})
export type ApiMain = z.infer<typeof ApiMain>
