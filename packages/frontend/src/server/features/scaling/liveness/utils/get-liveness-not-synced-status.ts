import { UnixTime } from '@l2beat/shared-pure'
import { type NotSyncedStatus } from '~/types/sync-status'
import { formatTimestamp } from '~/utils/dates'

export function getLivenessNotSyncedStatus(
  syncedUntil: UnixTime,
): NotSyncedStatus | undefined {
  const syncTarget = UnixTime.now().add(-6, 'hours').toStartOf('hour')
  const isSynced = syncedUntil.lte(syncTarget)
  if (isSynced) {
    return undefined
  }
  return {
    syncedUntil: syncedUntil.toNumber(),
    content: `Liveness data for this item is not synced since ${formatTimestamp(
      syncedUntil.toNumber(),
      {
        mode: 'datetime',
        longMonthName: true,
      },
    )}.`,
  }
}
