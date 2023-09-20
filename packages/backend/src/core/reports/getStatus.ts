import { getHourlyTimestamps, UnixTime } from '@l2beat/shared-pure'

import { StatusPoint } from '../../api/controllers/status/view/TvlStatusPage'

export function getStatus(
  updaterName: string,
  from: UnixTime,
  to: UnixTime,
  knownSet: Set<number>,
) {
  const timestamps = getHourlyTimestamps(from, to).sort(
    (a, b) => b.toNumber() - a.toNumber(),
  )

  const statuses: StatusPoint[] = timestamps.map((timestamp) => {
    if (knownSet.has(timestamp.toNumber())) {
      return {
        timestamp,
        status: 'synced',
      }
    } else {
      return {
        timestamp,
        status: 'notSynced',
      }
    }
  })

  return {
    updaterName,
    statuses: statuses,
  }
}
