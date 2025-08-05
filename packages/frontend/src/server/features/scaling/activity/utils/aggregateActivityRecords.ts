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

  const startIndex = entries.findIndex((e) => e.timestamp === startTimestamp)

  const aggregatedEntries = entries.slice(startIndex).reduce(
    (acc, entry) => {
      const timestamp = entry.timestamp
      const isEthereum = entry.projectId === ProjectId.ETHEREUM

      if (!acc[timestamp]) {
        acc[timestamp] = {
          timestamp: entry.timestamp,
          count: null,
          ethereumCount: null,
          uopsCount: null,
          ethereumUopsCount: null,
        }
      }

      if (isEthereum) {
        acc[timestamp].ethereumCount =
          acc[timestamp].ethereumCount !== null
            ? acc[timestamp].ethereumCount + entry.count
            : entry.count
        acc[timestamp].ethereumUopsCount =
          acc[timestamp].ethereumUopsCount !== null
            ? acc[timestamp].ethereumUopsCount +
              (entry.uopsCount ?? entry.count)
            : (entry.uopsCount ?? entry.count)
      } else {
        acc[timestamp].count =
          acc[timestamp].count !== null
            ? acc[timestamp].count + entry.count
            : entry.count
        acc[timestamp].uopsCount =
          acc[timestamp].uopsCount !== null
            ? acc[timestamp].uopsCount + (entry.uopsCount ?? entry.count)
            : (entry.uopsCount ?? entry.count)
      }

      return acc
    },
    {} as Record<
      number,
      {
        timestamp: UnixTime
        count: number | null
        ethereumCount: number | null
        uopsCount: number | null
        ethereumUopsCount: number | null
      }
    >,
  )

  return aggregatedEntries
}
