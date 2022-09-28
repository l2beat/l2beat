import z from 'zod'

import { UnixTime } from '../UnixTime'

const EventApiChartPoint = z
  .array(z.number().int())
  .refine((arr) => arr.length > 0 && UnixTime.isSafeToCast(arr[0]))
  .transform(
    ([first, ...rest]) =>
      [new UnixTime(first), ...rest] as [UnixTime, ...number[]],
  )
export type EventApiChartPoint = z.infer<typeof EventApiChartPoint>

const EventApiChart = z.object({
  types: z
    .array(z.string())
    .refine((arr) => arr.length > 0 && arr[0] === 'timestamp')
    .transform((arr) => arr as ['timestamp', ...string[]]),
  data: z.array(EventApiChartPoint),
})
export type EventApiChart = z.infer<typeof EventApiChart>

const EventApiCharts = z.object({
  hourly: EventApiChart,
  daily: EventApiChart,
})
export type EventApiCharts = z.infer<typeof EventApiCharts>

const EventApiResponse = z.object({
  projects: z.record(z.string(), EventApiCharts.optional()),
})
export type EventApiResponse = z.infer<typeof EventApiResponse>
