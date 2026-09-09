import { UnixTime } from '@l2beat/shared-pure'
import type { SyncState } from '~/server/features/utils/syncState'
import { formatTimestamp } from '~/utils/dates'

export function getActivityAdjustedTimestamp(timestmap: UnixTime): UnixTime {
  return UnixTime.toStartOf(timestmap, 'day') - 1 * UnixTime.DAY
}

export function getActivitySyncWarning(
  syncState: SyncState | undefined,
): string | undefined {
  if (!syncState || syncState.isSynced) return
  return `No activity data since ${formatTimestamp(syncState.syncedUntil, {
    mode: 'datetime',
    longMonthName: true,
  })}.`
}
