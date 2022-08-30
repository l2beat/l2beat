import z from 'zod'

import { branded } from './branded'
import { UnixTime } from './UnixTime'

const EventChartPoint = z.tuple([
  branded(z.number(), (n) => new UnixTime(n)),
  z.array(z.number()),
])
export type EventChartPoint = z.infer<typeof EventChartPoint>

const EventChart = z.object({
  types: z.tuple([z.literal('timestamp'), z.array(z.string())]),
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
