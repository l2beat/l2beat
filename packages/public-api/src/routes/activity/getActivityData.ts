import type {
  ActivityRecord,
  Database,
  SyncMetadataRecord,
} from '@l2beat/database'
import { assert, type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { rangeToDays } from '../../utils/range'
import type { ActivityRange, ActivityResultItem } from './types'

export async function getActivityData(
  db: Database,
  range: ActivityRange,
  projectIds: ProjectId[],
): Promise<ActivityResultItem[]> {
  const adjustedRange = await getFullySyncedActivityRange(db, range)

  const [entries, syncMetadata] = await Promise.all([
    db.activity.getByProjectsAndTimeRange(projectIds, adjustedRange),
    db.syncMetadata.getByFeatureAndIds('activity', projectIds),
  ])
  const lastSyncedDay = getLastSyncedDay(syncMetadata, adjustedRange[1])

  const aggregatedEntries = aggregateActivityRecords(entries)
  if (!aggregatedEntries || Object.values(aggregatedEntries).length === 0) {
    return []
  }

  const startTimestamp = Math.min(...Object.keys(aggregatedEntries).map(Number))

  const timestamps = generateTimestamps(
    [startTimestamp, adjustedRange[1]],
    'day',
  )

  return timestamps.map((timestamp: UnixTime) => {
    // Past the last synced day the data is missing, not zero, and a day being
    // synced holds a partial count
    if (lastSyncedDay === undefined || timestamp > lastSyncedDay) {
      return { timestamp, txCount: null, uopsCount: null }
    }

    // A synced day without a record had no blocks, so no transactions
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
  assert(target, 'Max target for feature not found')
  const end = UnixTime.toStartOf(target, 'day') - 1 * UnixTime.DAY
  const days = rangeToDays(range)

  const start = days !== null ? end - days * UnixTime.DAY : null
  return [start, end]
}

/**
 * The last day whose count is complete for at least one of the projects,
 * the same rule the website uses for a project's activity chart. A sum of
 * many projects is cut at its most synced project.
 */
function getLastSyncedDay(
  records: SyncMetadataRecord[],
  rangeEnd: UnixTime,
): UnixTime | undefined {
  const days = records.map((record) =>
    getProjectLastSyncedDay(record, rangeEnd),
  )
  const syncedDays = days.filter((day) => day !== undefined)
  return syncedDays.length > 0 ? Math.max(...syncedDays) : undefined
}

function getProjectLastSyncedDay(
  record: SyncMetadataRecord,
  rangeEnd: UnixTime,
): UnixTime | undefined {
  if (record.syncedUntil === null) {
    return undefined
  }
  // A chain that stopped making blocks is synced, though its time lags
  const isSynced =
    record.syncedUntil >= record.target ||
    (record.blockTarget !== null &&
      record.blockSyncedUntil === record.blockTarget)
  if (isSynced) {
    return rangeEnd
  }
  const lastFullDay =
    UnixTime.toStartOf(record.syncedUntil, 'day') - UnixTime.DAY
  return Math.min(lastFullDay, rangeEnd)
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
