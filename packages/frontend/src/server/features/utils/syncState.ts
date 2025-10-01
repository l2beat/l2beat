import type { SyncMetadataRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'

export interface SyncState {
  isSynced: boolean
  syncedUntil: UnixTime
  target: UnixTime
}

export function getSyncState(
  record: SyncMetadataRecord,
  timestamp: UnixTime,
): SyncState {
  const isSynced = isFeatureSynced(record, timestamp)
  const syncedUntil = isSynced
    ? record.target
    : (record.syncedUntil ?? UnixTime.now())
  return {
    isSynced: isFeatureSynced(record, timestamp),
    syncedUntil: Math.min(syncedUntil, timestamp),
    target: record.target,
  }
}

export function getActivitySyncState(
  record: SyncMetadataRecord,
  timestamp: UnixTime,
): SyncState {
  // Activity target in SyncMetadata is always the end of the day
  // Adjusted range is always the start of the day (fully synced timestamp), so we need to add 1 day to get the end of the day
  return getSyncState(record, timestamp + 1 * UnixTime.DAY)
}

function isFeatureSynced(
  record: SyncMetadataRecord,
  timestamp: UnixTime,
): boolean {
  return (
    (record.target >= timestamp &&
      record.syncedUntil &&
      record.syncedUntil >= timestamp) ||
    record.blockSyncedUntil === record.blockTarget
  )
}
