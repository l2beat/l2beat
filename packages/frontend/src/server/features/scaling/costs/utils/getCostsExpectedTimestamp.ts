import { UnixTime } from '@l2beat/shared-pure'

export function getCostsExpectedTimestamp(
  resolution: 'hourly' | 'sixHourly' | 'daily',
) {
  const period: Record<typeof resolution, 'hour' | 'six hours' | 'day'> = {
    hourly: 'hour',
    sixHourly: 'six hours',
    daily: 'day',
  }
  const offset: Record<typeof resolution, number> = {
    hourly: UnixTime.HOUR,
    sixHourly: UnixTime.SIX_HOURS,
    daily: UnixTime.DAY,
  }
  return (
    UnixTime.toStartOf(UnixTime.now(), period[resolution]) - offset[resolution]
  )
}
