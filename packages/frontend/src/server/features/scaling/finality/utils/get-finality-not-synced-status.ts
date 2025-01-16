import { UnixTime } from '@l2beat/shared-pure'
import { type NotSyncedStatus } from '~/types/sync-status'
import { formatTimestamp } from '~/utils/dates'

export function getFinalityNotSyncedStatus(
  syncedUntil: number,
): NotSyncedStatus | undefined {
  const isSynced = UnixTime.now()
    .add(-1, 'days')
    .add(-1, 'hours')
    .lte(new UnixTime(syncedUntil))

  if (isSynced) {
    return undefined
  }

  return {
    syncedUntil,
    content: `Finality data for this item is not synced since ${formatTimestamp(
      syncedUntil,
      {
        mode: 'datetime',
        longMonthName: true,
      },
    )}.`,
  }
}
