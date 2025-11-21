import type { UnixTime } from '@l2beat/shared-pure'

export type TimeRange = '1d' | '7d' | '30d' | '90d' | '180d' | '1y' | 'max'
type Resolution = 'hourly' | 'daily' | 'sixHourly'

export function getBucketValuesRange(
  range: [number | null, number],
  resolution: Resolution,
  opts?: {
    offset?: UnixTime
  },
): [UnixTime | null, UnixTime] {
  const [from, to] = Array.isArray(range) ? range : [range.from, range.to]
  return [from, to]

  // const days = rangeToDays(range)
  // const offset = opts?.offset ?? 0

  // const end = UnixTime.toStartOf(UnixTime.now() + offset, 'hour')
  // const start =
  //   days !== null
  //     ? UnixTime.toStartOf(
  //         end - days * UnixTime.DAY,
  //         resolution === 'daily'
  //           ? 'day'
  //           : resolution === 'sixHourly'
  //             ? 'six hours'
  //             : 'hour',
  //       )
  //     : null

  // return [start, end]
}
