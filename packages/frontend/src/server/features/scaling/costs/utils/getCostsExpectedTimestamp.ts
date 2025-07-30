import { UnixTime } from '@l2beat/shared-pure/build/types/UnixTime'

export function getCostsExpectedTimestamp(
  resolution: 'hourly' | 'sixHourly' | 'daily',
) {
  return (
    UnixTime.toStartOf(
      UnixTime.now(),
      resolution === 'daily'
        ? 'day'
        : resolution === 'sixHourly'
          ? 'six hours'
          : 'hour',
    ) -
    (resolution === 'daily'
      ? UnixTime.DAY
      : resolution === 'sixHourly'
        ? UnixTime.SIX_HOURS
        : UnixTime.HOUR)
  )
}
