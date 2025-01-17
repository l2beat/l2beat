import { UnixTime } from '@l2beat/shared-pure'
import { formatTimestamp } from '~/utils/dates'

export function isActivitySynced(syncedUntil: UnixTime): boolean {
  return UnixTime.now().add(-2, 'days').lte(syncedUntil)
}

export function getActivitySyncWarning(
  syncedUntil: UnixTime,
): string | undefined {
  if (isActivitySynced(syncedUntil)) {
    return undefined
  }

  return `Activity data for this item is not synced since ${formatTimestamp(
    syncedUntil.toNumber(),
    {
      mode: 'datetime',
      longMonthName: true,
    },
  )}.`
}
