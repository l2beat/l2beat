import { assert, notUndefined, type UnixTime } from '@l2beat/shared-pure'

export function getTimeRangeIntersection(
  ...timestamps: {
    sinceTimestamp?: UnixTime | undefined
    untilTimestamp?: UnixTime | undefined
  }[]
) {
  const sinceTimestamp = getSinceTimestamp(
    ...timestamps.map((t) => t.sinceTimestamp),
  )
  const untilTimestamp = getUntilTimestamp(
    ...timestamps.map((t) => t.untilTimestamp),
  )

  return {
    sinceTimestamp,
    untilTimestamp,
  }
}

function getSinceTimestamp(...timestamps: (UnixTime | undefined)[]): UnixTime {
  assert(
    timestamps.every((t) => t !== undefined),
    'sinceTimestamp should be defined',
  )

  return Math.max(...timestamps)
}

function getUntilTimestamp(
  ...timestamps: (UnixTime | undefined)[]
): UnixTime | undefined {
  const definedTimestamps = timestamps.filter(notUndefined)

  if (definedTimestamps.length === 0) {
    return undefined
  }

  return Math.min(...definedTimestamps)
}
