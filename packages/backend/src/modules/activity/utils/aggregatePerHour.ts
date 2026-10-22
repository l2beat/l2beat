import type { HourlyActivityRecord } from '@l2beat/database'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ActivityBlock } from '../services/txs/types'
import { addSums, type PeriodSum, sumPerPeriod } from './sumPerPeriod'

/**
 * Sums the blocks of each hour and finds its busiest UTC minute. Blocks are
 * fetched in batches, so a minute can start in the previous batch:
 * `previousMinute` is what that batch counted of its last minute, which it
 * returned as `lastMinute`. It counts towards the peak only, as the previous
 * batch has already added it to the hour
 */
export function aggregatePerHour(
  projectId: ProjectId,
  blocks: ActivityBlock[],
  previousMinute?: PeriodSum,
): { records: HourlyActivityRecord[]; lastMinute: PeriodSum | undefined } {
  const minutes = sumPerPeriod(blocks, 'minute')
  if (previousMinute && minutes[0]?.timestamp === previousMinute.timestamp) {
    minutes[0] = addSums(previousMinute, minutes[0])
  }

  const records = sumPerPeriod(blocks, 'hour').map((hour) => {
    const inHour = minutes.filter(
      (minute) =>
        UnixTime.toStartOf(minute.timestamp, 'hour') === hour.timestamp,
    )
    return {
      projectId,
      timestamp: hour.timestamp,
      count: hour.count,
      uopsCount: hour.uopsCount,
      peakCount: Math.max(...inHour.map((minute) => minute.count)),
      peakUopsCount:
        hour.uopsCount === null
          ? null
          : Math.max(...inHour.map((minute) => minute.uopsCount ?? 0)),
    }
  })

  return { records, lastMinute: minutes.at(-1) }
}
