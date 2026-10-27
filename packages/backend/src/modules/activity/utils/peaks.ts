import type { ActivityPeaks } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { addSums, type PeriodSum } from './sumPerPeriod'

type Counts = Pick<PeriodSum, 'timestamp' | 'count' | 'uopsCount'>

/** What a batch counted of its last minute, and the height it ended at */
export interface MinuteCarry {
  height: number
  minute: PeriodSum
}

/**
 * Blocks are fetched in batches, so the first minute of a batch can start in
 * the previous one. The carry counts only when that batch ended right before
 * `from`
 */
export function continueMinute(
  minutes: PeriodSum[],
  carry: MinuteCarry | undefined,
  from: number,
): PeriodSum[] {
  const [first, ...rest] = minutes
  if (
    !first ||
    carry?.height !== from - 1 ||
    first.timestamp !== carry.minute.timestamp
  ) {
    return minutes
  }
  return [addSums(carry.minute, first), ...rest]
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
