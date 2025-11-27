import { UnixTime } from '@l2beat/shared-pure'
import type { ChartResolution } from '~/utils/range/range'

export function getThroughputExpectedTimestamp({
  to,
  resolution,
}: {
  to: UnixTime
  resolution: ChartResolution
}) {
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

  return UnixTime.toStartOf(to, unit[resolution]) - span[resolution]
}
