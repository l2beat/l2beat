import { UnixTime } from '@l2beat/shared-pure'

type Resolution = 'hourly' | 'sixHourly' | 'daily'

const period: Record<Resolution, 'hour' | 'six hours' | 'day'> = {
  hourly: 'hour',
  sixHourly: 'six hours',
  daily: 'day',
}
const offset: Record<Resolution, number> = {
  hourly: UnixTime.HOUR,
  sixHourly: UnixTime.SIX_HOURS,
  daily: UnixTime.DAY,
}

export function getCostsExpectedTimestamp(
  to: UnixTime,
  resolution: Resolution,
) {
  return UnixTime.toStartOf(to, period[resolution]) - offset[resolution]
}
