import { UnixTime } from '@l2beat/shared-pure'

export function getThroughputExpectedTimestamp(
  resolution: 'hourly' | 'sixHourly' | 'daily',
  lastTimestamp?: UnixTime,
) {
  const now = lastTimestamp ?? UnixTime.now()

  const unit: Record<typeof resolution, 'hour' | 'six hours' | 'day'> = {
    hourly: 'hour',
    sixHourly: 'six hours',
    daily: 'day',
  }
  const span: Record<typeof resolution, number> = {
    hourly: UnixTime.HOUR,
    sixHourly: UnixTime.SIX_HOURS,
    daily: UnixTime.DAY,
  }

  return UnixTime.toStartOf(now, unit[resolution]) - span[resolution]
}
