import { assert, UnixTime } from '@l2beat/shared-pure'
import { rangeToDays } from './range-to-days'

export type TimeRange = '1d' | '7d' | '30d' | '90d' | '180d' | '1y' | 'max'
export type Resolution = 'hourly' | 'daily' | 'sixHourly'

export function getRange(
  range: Exclude<TimeRange, 'max'>,
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
  range: TimeRange,
  resolution: Resolution,
  opts?: {
    now?: UnixTime
    offset?: UnixTime
  },
): [UnixTime | null, UnixTime] {
  const days = rangeToDays(range)
  const offset = opts?.offset ?? 0
  const roundedNow = UnixTime.toStartOf(
    opts?.now ?? UnixTime.now(),
    resolution === 'hourly' ? 'hour' : 'day',
  )

  const start = days !== null ? roundedNow - days * UnixTime.DAY + offset : null
  const end = roundedNow + offset

  return [start, end]
}
