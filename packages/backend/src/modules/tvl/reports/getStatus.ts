import { UnixTime } from '@l2beat/shared-pure'

import { StatusPoint } from '../api/status/TvlStatusPage'

export function getStatus(
  updaterName: string,
  from: UnixTime,
  to: UnixTime,
  knownSet: Set<number>,
  minTimestamp?: UnixTime,
) {
  from = minTimestamp ? UnixTime.max(from, minTimestamp) : from
  const timestamps = getRelevantTimestamps(from, to).sort(
    (a, b) => b.toNumber() - a.toNumber(),
  )

  const statuses = timestamps.map(
    (timestamp): StatusPoint => ({
      timestamp,
      status: knownSet.has(timestamp.toNumber()) ? 'synced' : 'notSynced',
    }),
  )

  return { updaterName, statuses: statuses }
}

const ONE_HOUR = 3600

function getRelevantTimestamps(from: UnixTime, to: UnixTime) {
  const timestamps = []
  const hourlyCutoff = to.add(-7, 'days')
  const sixHourlyCutoff = to.add(-90, 'days')
  for (let i = from.toNumber(); i <= to.toNumber(); i += ONE_HOUR) {
    const timestamp = new UnixTime(i)
    if (
      timestamp.isFull('day') ||
      (timestamp.isFull('six hours') && timestamp.gte(sixHourlyCutoff)) ||
      timestamp.gte(hourlyCutoff)
    ) {
      timestamps.push(timestamp)
    }
  }
  return timestamps
}
