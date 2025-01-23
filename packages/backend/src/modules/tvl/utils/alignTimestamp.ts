import type { UnixTime } from '@l2beat/shared-pure'

export function alignTimestamp(
  timestamp: UnixTime,
  hourlyCutOff: UnixTime,
  sixHourlyCutOff: UnixTime,
): UnixTime {
  if (timestamp.gte(hourlyCutOff)) {
    return timestamp.toEndOf('hour')
  }

  if (timestamp.gte(sixHourlyCutOff)) {
    const result = timestamp.toEndOf('six hours')
    return result.lte(hourlyCutOff) ? result : hourlyCutOff
  }

  const result = timestamp.toEndOf('day')
  return result.lte(sixHourlyCutOff) ? result : sixHourlyCutOff
}
