import { UnixTime } from '@l2beat/shared-pure'
import { type NotSyncedStatus } from '~/types/not-synced-status'
import { formatTimestamp } from '~/utils/dates'

export function getCostsNotSyncedStatus(
  syncedUntil: UnixTime,
): NotSyncedStatus | undefined {
  const isSynced = UnixTime.now()
    .add(-1, 'days')
    .add(-1, 'hours')
    .lte(syncedUntil)
  if (isSynced) {
    return undefined
  }

  return {
    syncedUntil: syncedUntil.toNumber(),
    content: `Costs data for this item is not synced since ${formatTimestamp(
      syncedUntil.toNumber(),
      {
        mode: 'datetime',
        longMonthName: true,
      },
    )}.`,
  }
}
