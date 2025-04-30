import { UnixTime } from '@l2beat/shared-pure'

export function alignTimestamp(
  timestamp: UnixTime,
  hourlyCutOff: UnixTime,
  sixHourlyCutOff: UnixTime,
): UnixTime {
  if (timestamp >= hourlyCutOff) {
    return UnixTime.toEndOf(timestamp, 'hour')
  }

  if (timestamp >= sixHourlyCutOff) {
    const result = UnixTime.toEndOf(timestamp, 'six hours')
    return result <= hourlyCutOff ? result : hourlyCutOff
  }

  const result = UnixTime.toEndOf(timestamp, 'day')
  return result <= sixHourlyCutOff ? result : sixHourlyCutOff
}
