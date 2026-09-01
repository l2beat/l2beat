import type { SyncState } from '~/server/features/utils/syncState'
import { formatTimestamp } from '~/utils/dates'

export function getTvsSyncWarning(
  syncState: SyncState | undefined,
): string | undefined {
  if (!syncState || syncState.isSynced) return
  return `No Value Secured data since ${formatTimestamp(syncState.syncedUntil, {
    mode: 'datetime',
    longMonthName: true,
  })}.`
}
