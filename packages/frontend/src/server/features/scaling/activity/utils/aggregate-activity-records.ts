import type { ActivityRecord } from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'
import { ProjectId } from '@l2beat/shared-pure'

export function aggregateActivityRecords(
  entries: ActivityRecord[],
  forEthereum = false,
) {
  const startTimestamp = entries.find(
    (e) =>
      (forEthereum ? true : e.projectId !== ProjectId.ETHEREUM) && e.count > 0,
  )?.timestamp

  if (!startTimestamp) {
    return undefined
  }

  const startIndex = entries.findIndex(
    (e) => e.timestamp.toNumber() === startTimestamp.toNumber(),
  )

  const aggregatedEntries = entries.slice(startIndex).reduce(
    (acc, entry) => {
      const timestamp = entry.timestamp.toNumber()
      const isEthereum = entry.projectId === ProjectId.ETHEREUM

      if (!acc[timestamp]) {
        acc[timestamp] = {
          timestamp: entry.timestamp,
          count: 0,
          ethereumCount: 0,
          uopsCount: 0,
          ethereumUopsCount: 0,
        }
      }

      if (isEthereum) {
        acc[timestamp].ethereumCount += entry.count
        acc[timestamp].ethereumUopsCount += entry.uopsCount ?? entry.count
      } else {
        acc[timestamp].count += entry.count
        acc[timestamp].uopsCount += entry.uopsCount ?? entry.count
      }

      return acc
    },
    {} as Record<
      number,
      {
        timestamp: UnixTime
        count: number
        ethereumCount: number
        uopsCount: number
        ethereumUopsCount: number
      }
    >,
  )

  return aggregatedEntries
}
