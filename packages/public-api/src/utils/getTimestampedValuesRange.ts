import { UnixTime } from '@l2beat/shared-pure'
import { rangeToDays } from './range'
import type { Range, Resolution } from './types'

export function getTimestampedValuesRange(
  range: Range,
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

function getBucketValuesRange(
  range: Range,
  resolution: Resolution,
  opts?: {
    offset?: UnixTime
  },
): [UnixTime | null, UnixTime] {
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
