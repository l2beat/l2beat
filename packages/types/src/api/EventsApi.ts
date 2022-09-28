import z from 'zod'

import { UnixTime } from '../UnixTime'

const EventsApiChartPoint = z
  .array(z.number().int())
  .refine((arr) => arr.length > 0 && UnixTime.isSafeToCast(arr[0]))
  .transform(
    ([first, ...rest]) =>
      [new UnixTime(first), ...rest] as [UnixTime, ...number[]],
  )
export type EventsApiChartPoint = z.infer<typeof EventsApiChartPoint>

const EventsApiChart = z.object({
  types: z
    .array(z.string())
    .refine((arr) => arr.length > 0 && arr[0] === 'timestamp')
    .transform((arr) => arr as ['timestamp', ...string[]]),
  data: z.array(EventsApiChartPoint),
})
export type EventsApiChart = z.infer<typeof EventsApiChart>

const EventsApiCharts = z.object({
  hourly: EventsApiChart,
  daily: EventsApiChart,
})
export type EventsApiCharts = z.infer<typeof EventsApiCharts>

const EventsApiResponse = z.object({
  projects: z.record(z.string(), EventsApiCharts.optional()),
})
export type EventsApiResponse = z.infer<typeof EventsApiResponse>
