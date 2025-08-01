import { UnixTime } from '@l2beat/shared-pure'
import { formatTimestamp } from '~/utils/dates'

export function isActivitySynced(syncedUntil: UnixTime): boolean {
  return UnixTime.now() - 2 * UnixTime.DAY <= syncedUntil
}

export function getActivitySyncWarning(
  syncedUntil: UnixTime,
): string | undefined {
  if (isActivitySynced(syncedUntil)) {
    return undefined
  }

  return `No activity data since ${formatTimestamp(syncedUntil, {
    mode: 'datetime',
    longMonthName: true,
  })}.`
}
