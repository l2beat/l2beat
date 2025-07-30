import { UnixTime } from '@l2beat/shared-pure'
import { rangeToDays } from './rangeToDays'

export type TimeRange = '1d' | '7d' | '30d' | '90d' | '180d' | '1y' | 'max'
export type Resolution = 'hourly' | 'daily' | 'sixHourly'

export function getRange(
  range: { type: TimeRange } | { type: 'custom'; from: number; to: number },
  resolution: Resolution,
): [UnixTime | null, UnixTime] {
  if (range.type === 'custom') {
    const { from, to } = range
    return [from, to]
  }

  const days = rangeToDays(range)

  const end = UnixTime.toStartOf(UnixTime.now(), 'hour')
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
