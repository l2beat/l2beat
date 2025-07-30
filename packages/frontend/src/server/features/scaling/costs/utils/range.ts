import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { TimeRange } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'

export const CostsTimeRange = v.union([
  v.literal('1d'),
  v.literal('7d'),
  v.literal('30d'),
  v.literal('90d'),
  v.literal('180d'),
  v.literal('1y'),
  v.literal('max'),
])
export type CostsTimeRange = v.infer<typeof CostsTimeRange>

export function getCostsRange(
  range: { type: TimeRange } | { type: 'custom'; from: number; to: number },
): [UnixTime | null, UnixTime] {
  if (range.type === 'custom') {
    const { from, to } = range as { from: number; to: number }
    return [from, to]
  }

  const resolution = rangeToResolution(range.type)

  const end = UnixTime.toStartOf(UnixTime.now(), 'hour')

  const days = rangeToDays(range)

  const start =
    days !== null
      ? UnixTime.toStartOf(
          end - days * UnixTime.DAY,
          resolution === 'daily'
            ? 'day'
            : resolution === 'sixHourly'
              ? 'six hours'
              : 'hour',
        )
      : null
  return [start, end]
}

export type CostsResolution = ReturnType<typeof rangeToResolution>
export function rangeToResolution(value: CostsTimeRange) {
  const days = rangeToDays({ type: value })
  if (days && days < 30) {
    return 'hourly'
  }
  if (days && days <= 90) {
    return 'sixHourly'
  }

  return 'daily'
}
