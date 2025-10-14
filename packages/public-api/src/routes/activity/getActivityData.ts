import type { ActivityRecord, Database } from '@l2beat/database'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { rangeToDays } from '../../utils/range'
import type { ActivityRange, ActivityResultItem } from './types'

export async function getActivityData(
  db: Database,
  range: ActivityRange,
  projectIds: ProjectId[],
): Promise<ActivityResultItem[]> {
  const adjustedRange = await getFullySyncedActivityRange(db, range)

  const entries = await db.activity.getByProjectsAndTimeRange(
    projectIds,
    adjustedRange,
  )

  const aggregatedEntries = aggregateActivityRecords(entries)
  if (!aggregatedEntries || Object.values(aggregatedEntries).length === 0) {
    return []
  }

  const startTimestamp = Math.min(...Object.keys(aggregatedEntries).map(Number))

  const timestamps = generateTimestamps(
    [startTimestamp, adjustedRange[1]],
    'daily',
  )

  return timestamps.map((timestamp: UnixTime) => {
    const entry = aggregatedEntries[timestamp]
    if (!entry) {
      return {
        timestamp,
        txCount: 0,
        uopsCount: 0,
      }
    }

    return {
      timestamp,
      txCount: entry.count ?? 0,
      uopsCount: entry.uopsCount ?? 0,
    }
  })
}

async function getFullySyncedActivityRange(
  db: Database,
  range: ActivityRange,
): Promise<[UnixTime | null, UnixTime]> {
  const target = await db.syncMetadata.getMaxTargetForFeature('activity')
  const end = UnixTime.toStartOf(target, 'day') - 1 * UnixTime.DAY
  const days = rangeToDays(range)

  const start = days !== null ? end - days * UnixTime.DAY : null
  return [start, end]
}

function aggregateActivityRecords(entries: ActivityRecord[]) {
  const startTimestamp = entries.find((e) => e.count > 0)?.timestamp

  if (!startTimestamp) {
    return []
  }

  const startIndex = entries.findIndex((e) => e.timestamp === startTimestamp)

  const aggregatedEntries = entries.slice(startIndex).reduce(
    (acc, entry) => {
      const timestamp = entry.timestamp

      if (!acc[timestamp]) {
        acc[timestamp] = {
          timestamp: entry.timestamp,
          count: 0,
          uopsCount: 0,
        }
      }

      acc[timestamp].count = acc[timestamp].count + entry.count
      acc[timestamp].uopsCount =
        acc[timestamp].uopsCount + (entry.uopsCount ?? entry.count)

      return acc
    },
    {} as Record<
      number,
      {
        timestamp: UnixTime
        count: number
        uopsCount: number
      }
    >,
  )

  return aggregatedEntries
}
