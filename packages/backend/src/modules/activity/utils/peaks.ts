import type { ActivityPeaks } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { addSums, type PeriodSum } from './sumPerPeriod'

interface Counts {
  timestamp: UnixTime
  count: number
  uopsCount: number | null
}

/**
 * Blocks are fetched in batches, so the first minute of a batch can start in
 * the previous one: `previousMinute` is that batch's last minute
 */
export function continueMinute(
  minutes: PeriodSum[],
  previousMinute: PeriodSum | undefined,
): PeriodSum[] {
  const [first, ...rest] = minutes
  if (!first || first.timestamp !== previousMinute?.timestamp) return minutes
  return [addSums(previousMinute, first), ...rest]
}

/**
 * The busiest hour and minute of the day among the ones given. A batch's hours
 * must be as stored after adding it, as it may hold only part of them
 */
export function getDayPeaks(
  day: UnixTime,
  hours: Counts[],
  minutes: Counts[],
): ActivityPeaks {
  const hour = getPeak(day, hours)
  const minute = getPeak(day, minutes)
  return {
    peakHourCount: hour.count,
    peakHourUopsCount: hour.uopsCount,
    peakMinuteCount: minute.count,
    peakMinuteUopsCount: minute.uopsCount,
  }
}

function getPeak(day: UnixTime, periods: Counts[]) {
  const inDay = periods.filter(
    (period) => UnixTime.toStartOf(period.timestamp, 'day') === day,
  )
  const uops = inDay.flatMap((period) => period.uopsCount ?? [])
  return {
    count: Math.max(...inDay.map((period) => period.count)),
    uopsCount: uops.length > 0 ? Math.max(...uops) : null,
  }
}
