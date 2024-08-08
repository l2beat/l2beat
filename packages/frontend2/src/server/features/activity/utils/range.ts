import { UnixTime } from '@l2beat/shared-pure'
import { z } from 'zod'
import { rangeToDays } from '../../tvl/range-utils'

export type ActivityTimeRange = z.infer<typeof ActivityTimeRange>
export const ActivityTimeRange = z.enum([
  '7d',
  '30d',
  '90d',
  '180d',
  '1y',
  'max',
])

/**
 * Returns a range of days that are fully synced.
 *
 * Fully synced means that the day is synced to the midnight. Current day is not included.
 */
export function getFullySyncedActivityRange(
  range: ActivityTimeRange,
): [UnixTime, UnixTime] {
  const days = rangeToDays(range)

  const startOfDay = UnixTime.now().toStartOf('day')

  const end = startOfDay
  const start = end.add(-days, 'days')
  return [start, end]
}
