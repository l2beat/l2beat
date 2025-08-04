import { UnixTime } from '@l2beat/shared-pure'
import { rangeToDays } from './rangeToDays'

export type TimeRange = '1d' | '7d' | '30d' | '90d' | '180d' | '1y' | 'max'
type Resolution = 'hourly' | 'daily' | 'sixHourly'

export function getTimestampedValuesRange(
  range: { type: TimeRange } | { type: 'custom'; from: number; to: number },
  resolution: Resolution,
  opts?: {
    offset?: UnixTime
  },
): [UnixTime | null, UnixTime] {
  const [from, to] = getBucketValuesRange(range, resolution, opts)

  const adjustedFrom =
    from !== null
      ? from +
        (resolution === 'daily'
          ? UnixTime.DAY
          : resolution === 'sixHourly'
            ? UnixTime.SIX_HOURS
            : UnixTime.HOUR)
      : null

  return [adjustedFrom, to]
}

export function getBucketValuesRange(
  range: { type: TimeRange } | { type: 'custom'; from: number; to: number },
  resolution: Resolution,
  opts?: {
    offset?: UnixTime
  },
): [UnixTime | null, UnixTime] {
  if (range.type === 'custom') {
    const { from, to } = range
    return [from, to]
  }

  const days = rangeToDays(range)
  const offset = opts?.offset ?? 0

  const end = UnixTime.toStartOf(UnixTime.now() + offset, 'hour')
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
