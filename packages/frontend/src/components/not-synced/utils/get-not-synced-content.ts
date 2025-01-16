import { type SyncStatus } from '~/types/sync-status'
import { formatTimestamp } from '~/utils/dates'

export function getNotSyncedContent(syncStatus: SyncStatus) {
  switch (syncStatus.type) {
    case 'tvs':
      return `TVS data for this item is not synced since ${formatTimestamp(
        syncStatus.syncedUntil,
        {
          mode: 'datetime',
          longMonthName: true,
        },
      )}.`
    case 'activity':
      return `Activity data for this item is not synced since ${formatTimestamp(
        syncStatus.syncedUntil,
        {
          mode: 'datetime',
          longMonthName: true,
        },
      )}.`
    default:
      return `The data for this item is not synced since ${formatTimestamp(
        syncStatus.syncedUntil,
        {
          mode: 'datetime',
          longMonthName: true,
        },
      )}.`
  }
}
