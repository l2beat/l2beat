import z from 'zod'

import { branded } from '../branded'
import { UnixTime } from '../UnixTime'

export const ActivityApiChartPoint = z.tuple([
  branded(z.number(), (n) => new UnixTime(n)),
  z.number().int(),
  z.number().int(),
])
export type ActivityApiChartPoint = z.infer<typeof ActivityApiChartPoint>

export const ActivityApiChart = z.object({
  types: z.tuple([
    z.literal('timestamp'),
    z.literal('transactions'),
    z.literal('ethereumTransactions'),
  ]),
  data: z.array(ActivityApiChartPoint),
})
export type ActivityApiChart = z.infer<typeof ActivityApiChart>

export const ActivityApiCharts = z.object({
  daily: ActivityApiChart,
})
export type ActivityApiCharts = z.infer<typeof ActivityApiCharts>

export const ActivityApiResponse = z.object({
  combined: ActivityApiCharts,
  projects: z.record(z.string(), z.optional(ActivityApiCharts)),
})
export type ActivityApiResponse = z.infer<typeof ActivityApiResponse>
