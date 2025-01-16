import { UnixTime } from '@l2beat/shared-pure'
import { type SyncStatus } from '~/types/sync-status'

export function getActivitySyncStatus(
  syncedUntil: UnixTime,
): SyncStatus | undefined {
  const isSynced = UnixTime.now().add(-2, 'days').lte(syncedUntil)
  if (isSynced) {
    return undefined
  }
  return {
    syncedUntil: syncedUntil.toNumber(),
    type: 'activity',
  }
}
