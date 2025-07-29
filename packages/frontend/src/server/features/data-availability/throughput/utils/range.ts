import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { CostsTimeRange } from '~/server/features/scaling/costs/utils/range'
import type { DataPostedTimeRange } from '~/server/features/scaling/data-posted/range'
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
export function getFullySyncedDaThroughputRange(
  range:
    | { type: DataPostedTimeRange }
    | { type: 'custom'; from: number; to: number },
): [UnixTime | null, UnixTime] {
  if (range.type === 'custom') {
    const { from, to } = range as { from: number; to: number }
    return [from, to]
  }

  const resolution = rangeToResolution({ type: range.type })

  const end = UnixTime.toStartOf(
    UnixTime.now(),
    resolution === 'hourly'
      ? 'hour'
      : resolution === 'sixHourly'
        ? 'six hours'
        : 'day',
  )
  const days = rangeToDays(range)

  const start = days !== null ? end - days * UnixTime.DAY : null
  return [start, end]
}

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
