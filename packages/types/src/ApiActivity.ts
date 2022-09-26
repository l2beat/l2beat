import z from 'zod'

import { branded } from './branded'
import { UnixTime } from './UnixTime'

const ChartPoint = z.tuple([
  branded(z.number(), (n) => new UnixTime(n)),
  z.number().int(),
])
export type ChartPoint = z.infer<typeof ChartPoint>

const Chart = z.object({
  types: z.tuple([z.literal('timestamp'), z.literal('daily tx count')]),
  data: z.array(ChartPoint),
})
export type Chart = z.infer<typeof Chart>

export const ApiActivity = z.object({
  combined: Chart,
  projects: z.record(z.string(), Chart),
})
export type ApiActivity = z.infer<typeof ApiActivity>
