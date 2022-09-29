import z from 'zod'

import { branded } from '../branded'
import { UnixTime } from '../UnixTime'

export const ActivityApiChartPoint = z.tuple([
  branded(z.number(), (n) => new UnixTime(n)),
  z.number().int(),
])
export type ActivityApiChartPoint = z.infer<typeof ActivityApiChartPoint>

export const ActivityApiChart = z.object({
  types: z.tuple([z.literal('timestamp'), z.literal('daily tx count')]),
  data: z.array(ActivityApiChartPoint),
})
export type ActivityApiChart = z.infer<typeof ActivityApiChart>

export const ActivityApiResponse = z.object({
  combined: ActivityApiChart,
  projects: z.record(z.string(), z.optional(ActivityApiChart)),
  ethereum: ActivityApiChart,
})
export type ActivityApiResponse = z.infer<typeof ActivityApiResponse>
