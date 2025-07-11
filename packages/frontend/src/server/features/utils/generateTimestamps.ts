import { assertUnreachable, UnixTime } from '@l2beat/shared-pure'
import range from 'lodash/range'

interface Options {
  addTarget?: boolean
}

export function generateTimestamps(
  [from, to]: [UnixTime, UnixTime],
  resolution: 'hourly' | 'sixHourly' | 'daily',
  opts?: Options,
) {
  const generated = range(
    Math.floor((to - from) / divider(resolution)) + 1,
  ).map((i) => {
    return (
      from +
      UnixTime(i * (resolution === 'sixHourly' ? 6 : 1)) *
        (resolution === 'hourly' || resolution === 'sixHourly'
          ? UnixTime.HOUR
          : UnixTime.DAY)
    )
  })
  const isLastGeneratedTarget = generated.at(-1) === to
  if (opts?.addTarget && !isLastGeneratedTarget) {
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
