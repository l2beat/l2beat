import z from 'zod'

import { UnixTime } from './UnixTime'

const EventChartPoint = z
  .array(z.number().int())
  .refine((arr) => arr.length > 0 && UnixTime.isSafeToCast(arr[0]))
  .transform(
    ([first, ...rest]) =>
      [new UnixTime(first), ...rest] as [UnixTime, ...number[]],
  )
export type EventChartPoint = z.infer<typeof EventChartPoint>

const EventChart = z.object({
  types: z
    .array(z.string())
    .refine((arr) => arr.length > 0 && arr[0] === 'timestamp')
    .transform((arr) => arr as ['timestamp', ...string[]]),
  data: z.array(EventChartPoint),
})
export type EventChart = z.infer<typeof EventChart>

const EventCharts = z.object({
  hourly: EventChart,
  sixHourly: EventChart,
  daily: EventChart,
})
export type EventCharts = z.infer<typeof EventCharts>

const ApiEvents = z.object({
  projects: z.record(z.string(), EventCharts.optional()),
})
export type ApiEvents = z.infer<typeof ApiEvents>
