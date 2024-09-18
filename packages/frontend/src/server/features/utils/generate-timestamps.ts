import { UnixTime, assertUnreachable } from '@l2beat/shared-pure'
import { range } from 'lodash'

export function generateTimestamps(
  [from, to]: [UnixTime, UnixTime],
  resolution: 'hourly' | 'sixHourly' | 'daily',
) {
  return range(
    Math.floor((to.toNumber() - from.toNumber()) / divider(resolution)) + 1,
  ).map((i) => {
    return from.add(
      i * (resolution === 'sixHourly' ? 6 : 1),
      resolution === 'hourly' || resolution === 'sixHourly' ? 'hours' : 'days',
    )
  })
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
