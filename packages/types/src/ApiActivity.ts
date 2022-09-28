import z from 'zod'

import { branded } from './branded'
import { UnixTime } from './UnixTime'

export const ActivityChartPoint = z.tuple([
  branded(z.number(), (n) => new UnixTime(n)),
  z.number().int(),
])
export type ActivityChartPoint = z.infer<typeof ActivityChartPoint>

export const ActivityChart = z.object({
  types: z.tuple([z.literal('timestamp'), z.literal('daily tx count')]),
  data: z.array(ActivityChartPoint),
})
export type ActivityChart = z.infer<typeof ActivityChart>

export const ApiActivity = z.object({
  combined: ActivityChart,
  projects: z.record(z.string(), z.optional(ActivityChart)),
})
export type ApiActivity = z.infer<typeof ApiActivity>
