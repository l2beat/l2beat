import { UnixTime } from '@l2beat/shared-pure'
import { type NotSyncedStatus } from '~/types/not-synced-status'
import { formatTimestamp } from '~/utils/dates'

export function getActivityNotSyncedStatus(
  syncedUntil: UnixTime,
): NotSyncedStatus | undefined {
  const isSynced = UnixTime.now().add(-2, 'days').lte(syncedUntil)
  if (isSynced) {
    return undefined
  }

  return {
    syncedUntil: syncedUntil.toNumber(),
    content: `Activity data for this item is not synced since ${formatTimestamp(
      syncedUntil.toNumber(),
      {
        mode: 'datetime',
        longMonthName: true,
      },
    )}.`,
  }
}
