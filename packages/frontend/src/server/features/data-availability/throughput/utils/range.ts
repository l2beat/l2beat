import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { CostsTimeRange } from '~/server/features/scaling/costs/utils/range'
import type { DataPostedTimeRange } from '~/server/features/scaling/data-posted/range'
import { getBucketValuesRange } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'

export const DaThroughputTimeRangeValues = [
  '7d',
  '30d',
  '90d',
  '180d',
  '1y',
  'max',
] as const
export type DaThroughputTimeRange = v.infer<typeof DaThroughputTimeRange>
export const DaThroughputTimeRange = v.enum(DaThroughputTimeRangeValues)

/**
 * Returns a range of days that are fully synced.
 */
export function getThroughputRange(
  range:
    | { type: DataPostedTimeRange }
    | { type: 'custom'; from: number; to: number },
): [UnixTime | null, UnixTime] {
  return getBucketValuesRange(range, rangeToResolution(range), {
    offset: -UnixTime.HOUR - 15 * UnixTime.MINUTE,
  })
}

export type DaThroughputResolution = ReturnType<typeof rangeToResolution>
export function rangeToResolution(
  range:
    | { type: DaThroughputTimeRange | CostsTimeRange }
    | { type: 'custom'; from: number; to: number },
) {
  const days = rangeToDays(range)
  if (days && days <= 7) return 'hourly'
  if (days && days < 180) return 'sixHourly'
  return 'daily'
}
