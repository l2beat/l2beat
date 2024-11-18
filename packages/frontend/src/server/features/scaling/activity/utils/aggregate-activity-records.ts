import { type ActivityRecord } from '@l2beat/database'
import { ProjectId, type UnixTime } from '@l2beat/shared-pure'

export function aggregateActivityEntries(entries: ActivityRecord[]) {
  const startTimestamp = entries.find(
    (e) => e.projectId !== ProjectId.ETHEREUM && e.count > 0,
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
        }
      }

      if (isEthereum) {
        acc[timestamp].ethereumCount += entry.count
      } else {
        acc[timestamp].count += entry.count
      }

      return acc
    },
    {} as Record<
      number,
      { timestamp: UnixTime; count: number; ethereumCount: number }
    >,
  )

  return aggregatedEntries
}
