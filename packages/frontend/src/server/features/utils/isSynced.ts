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
