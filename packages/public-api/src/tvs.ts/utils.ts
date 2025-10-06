import { assertUnreachable, UnixTime } from '@l2beat/shared-pure'
import range from 'lodash/range'
import { rangeToDays, type TvsRange, type TvsResolution } from './types'

export function getTimestampedValuesRange(
  range: TvsRange,
  resolution: TvsResolution,
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
  range: TvsRange,
  resolution: TvsResolution,
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

export function generateTimestamps(
  [from, to]: [UnixTime, UnixTime],
  resolution: 'hourly' | 'sixHourly' | 'daily',
) {
  const adjustedFrom = UnixTime.toEndOf(
    from,
    resolution === 'hourly'
      ? 'hour'
      : resolution === 'sixHourly'
        ? 'six hours'
        : 'day',
  )

  const generated = range(
    Math.floor((to - from) / divider(resolution)) + 1,
  ).map((i) => {
    return (
      adjustedFrom +
      UnixTime(i * (resolution === 'sixHourly' ? 6 : 1)) *
        (resolution === 'hourly' || resolution === 'sixHourly'
          ? UnixTime.HOUR
          : UnixTime.DAY)
    )
  })
  const isLastGeneratedTarget = generated.at(-1) === to
  if (!isLastGeneratedTarget) {
    generated.push(to)
  }

  return generated
}

function divider(resolution: 'hourly' | 'sixHourly' | 'daily') {
  switch (resolution) {
    case 'hourly':
      return UnixTime.HOUR
    case 'sixHourly':
      return UnixTime.SIX_HOURS
    case 'daily':
      return UnixTime.DAY
    default:
      assertUnreachable(resolution)
  }
}
