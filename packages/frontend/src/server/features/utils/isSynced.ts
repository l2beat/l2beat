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
  const isSynced = isFeatureSynced(record)
  const syncedUntil = isSynced
    ? record.target
    : (record.syncedUntil ?? UnixTime.now())
  return {
    isSynced: isFeatureSyncedAtTimestamp(record, timestamp),
    syncedUntil: Math.min(syncedUntil, timestamp),
    target: record.target,
  }
}

function isFeatureSyncedAtTimestamp(
  record: SyncMetadataRecord,
  timestamp: UnixTime,
): boolean {
  return isFeatureSynced(record) && timestamp <= record.target
}

function isFeatureSynced(record: SyncMetadataRecord): boolean {
  return (
    record.syncedUntil === record.target ||
    record.blockSyncedUntil === record.blockTarget
  )
}
