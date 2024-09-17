import { UnixTime } from '@l2beat/shared-pure'
import { range } from 'lodash'

export function generateTimestamps(
  [from, to]: [UnixTime, UnixTime],
  resolution: 'hourly' | 'sixHourly' | 'daily',
) {
  return range(
    (to.toNumber() - from.toNumber()) /
      (resolution === 'hourly'
        ? UnixTime.HOUR
        : resolution === 'sixHourly'
          ? UnixTime.SIX_HOURS
          : UnixTime.DAY) +
      1,
  ).map((i) => {
    return from.add(
      i * (resolution === 'sixHourly' ? 6 : 1),
      resolution === 'hourly' || resolution === 'sixHourly' ? 'hours' : 'days',
    )
  })
}
