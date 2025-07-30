import { assert, UnixTime } from '@l2beat/shared-pure'
import { rangeToDays } from './rangeToDays'

export type TimeRange = '1d' | '7d' | '30d' | '90d' | '180d' | '1y' | 'max'
export type Resolution = 'hourly' | 'daily' | 'sixHourly'

export function getRange(
  range:
    | { type: Exclude<TimeRange, 'max'> }
    | { type: 'custom'; from: number; to: number },
  resolution: Resolution,
  opts?: {
    now?: UnixTime
  },
): [UnixTime, UnixTime] {
  const days = rangeToDays(range)
  assert(days !== null, 'Range cannot be max')

  const roundedNow = UnixTime.toStartOf(
    opts?.now ?? UnixTime.now(),
    resolution === 'hourly' ? 'hour' : 'day',
  )

  const start = roundedNow - days * UnixTime.DAY
  const end = roundedNow

  return [start, end]
}

export function getRangeWithMax(
  range: { type: TimeRange } | { type: 'custom'; from: number; to: number },
  resolution: Resolution,
  opts?: {
    now?: UnixTime
    offset?: UnixTime
  },
): [UnixTime | null, UnixTime] {
  const days = rangeToDays(range)
  const offset = opts?.offset ?? 0
  const roundedNow = UnixTime.toStartOf(opts?.now ?? UnixTime.now(), 'hour')

  const start =
    days !== null
      ? UnixTime.toStartOf(
          roundedNow - days * UnixTime.DAY + offset,
          resolution === 'daily'
            ? 'day'
            : resolution === 'sixHourly'
              ? 'six hours'
              : 'hour',
        )
      : null
  const end = roundedNow + offset

  return [start, end]
}
