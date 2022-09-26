import z from 'zod'

import { branded } from './branded'
import { UnixTime } from './UnixTime'

const ChartPoint = z.tuple([
  branded(z.number(), (n) => new UnixTime(n)),
  z.number().int(),
])
export type ChartPoint = z.infer<typeof ChartPoint>

const Chart = z.object({
  types: z.tuple([z.literal('timestamp'), z.string()]),
  data: z.array(ChartPoint),
})
export type Chart = z.infer<typeof Chart>

export const Charts = z.object({
  hourly: Chart,
  sixHourly: Chart,
  daily: Chart,
})
export type Charts = z.infer<typeof Charts>

export const ApiActivity = z.object({
  combined: Charts,
  projects: z.record(z.string(), Charts),
})
export type ApiActivity = z.infer<typeof ApiActivity>
