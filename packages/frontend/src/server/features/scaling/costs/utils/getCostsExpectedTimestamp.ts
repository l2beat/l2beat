import { UnixTime } from '@l2beat/shared-pure'
import type { ChartResolution } from '~/utils/range/range'

const period: Record<ChartResolution, 'hour' | 'six hours' | 'day'> = {
  hourly: 'hour',
  sixHourly: 'six hours',
  daily: 'day',
}
const offset: Record<ChartResolution, number> = {
  hourly: UnixTime.HOUR,
  sixHourly: UnixTime.SIX_HOURS,
  daily: UnixTime.DAY,
}

export function getCostsExpectedTimestamp(
  to: UnixTime,
  resolution: ChartResolution,
) {
  return UnixTime.toStartOf(to, period[resolution]) - offset[resolution]
}
