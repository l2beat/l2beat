import { UnixTime } from '@l2beat/shared-pure'
import { formatTimestamp } from '~/utils/dates'

export function isLivenessSynced(syncedUntil: UnixTime): boolean {
  const syncTarget = UnixTime.toStartOf(
    UnixTime.now() - 6 * UnixTime.HOUR,
    'hour',
  )
  return syncTarget <= syncedUntil
}

export function getLivenessSyncWarning(
  syncedUntil: UnixTime,
): string | undefined {
  if (isLivenessSynced(syncedUntil)) {
    return undefined
  }
  return `No liveness data since ${formatTimestamp(syncedUntil, {
    mode: 'datetime',
    longMonthName: true,
  })}.`
}
