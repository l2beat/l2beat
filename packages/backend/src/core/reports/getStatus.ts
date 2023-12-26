import { getHourlyTimestamps, UnixTime } from '@l2beat/shared-pure'

import { StatusPoint } from '../../api/controllers/status/view/TvlStatusPage'

export function getStatus(
  updaterName: string,
  from: UnixTime,
  to: UnixTime,
  knownSet: Set<number>,
  minTimestamp?: UnixTime,
) {
  const timestamps = getHourlyTimestamps(from, to).sort(
    (a, b) => b.toNumber() - a.toNumber(),
  )

  const statuses: StatusPoint[] = timestamps.map((timestamp) => {
    if (minTimestamp && timestamp.toNumber() < minTimestamp.toNumber()) {
      return {
        timestamp,
        status: 'notApplicable',
      }
    }

    if (knownSet.has(timestamp.toNumber())) {
      return {
        timestamp,
        status: 'synced',
      }
    }

    return {
      timestamp,
      status: 'notSynced',
    }
  })

  return {
    updaterName,
    statuses: statuses,
  }
}
