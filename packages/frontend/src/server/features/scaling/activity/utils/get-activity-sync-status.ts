import { UnixTime } from '@l2beat/shared-pure'
import { type SyncStatus } from '~/types/sync-status'
import { formatTimestamp } from '~/utils/dates'

export function getActivitySyncStatus(syncedUntil: UnixTime): SyncStatus {
  const isSynced = UnixTime.now().add(-2, 'days').lte(syncedUntil)
  return {
    isSynced,
    syncedUntil: syncedUntil.toNumber(),
    type: 'activity',
    content: `Activity data for this item is not synced till ${formatTimestamp(
      syncedUntil.toNumber(),
      {
        mode: 'datetime',
        longMonthName: true,
      },
    )}.`,
  }
}
