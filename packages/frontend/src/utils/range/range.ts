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

  const start = roundedNow - UnixTime(days, 'days')
  const end = roundedNow

  return [start, end]
}

export function getRangeWithMax(
  range: TimeRange,
  resolution: Resolution,
  opts?: {
    now?: UnixTime
  },
): [UnixTime | null, UnixTime] {
  const days = rangeToDays(range)

  const roundedNow = UnixTime.toStartOf(
    opts?.now ?? UnixTime.now(),
    resolution === 'hourly' ? 'hour' : 'day',
  )

  const start = days !== null ? roundedNow - UnixTime(days, 'days') : null
  const end = roundedNow

  return [start, end]
}
