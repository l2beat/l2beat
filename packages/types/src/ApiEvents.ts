import z from 'zod'

import { branded } from './branded'
import { ProjectId } from './ProjectId'
import { UnixTime } from './UnixTime'

const EventChart = z.object({
  types: z.tuple([z.literal('timestamp'), z.array(z.string())]),
  data: z.array(
    z.tuple([branded(z.number(), (n) => new UnixTime(n)), z.array(z.number())]),
  ),
})
export type EventChart = z.infer<typeof EventChart>

const EventCharts = z.object({
  hourly: EventChart,
  sixHourly: EventChart,
  daily: EventChart,
})
export type EventCharts = z.infer<typeof EventCharts>

const ApiEvents = z.object({
  charts: EventCharts,
  projects: z.record(
    branded(z.string(), (p) => ProjectId(p)),
    EventCharts.optional(),
  ),
})
export type ApiEvents = z.infer<typeof ApiEvents>
