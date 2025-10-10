import { assertUnreachable, UnixTime } from '@l2beat/shared-pure'
import range from 'lodash/range'
import type { Resolution } from './types'

export function generateTimestamps(
  [from, to]: [UnixTime, UnixTime],
  resolution: Resolution,
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

function divider(resolution: Resolution) {
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
