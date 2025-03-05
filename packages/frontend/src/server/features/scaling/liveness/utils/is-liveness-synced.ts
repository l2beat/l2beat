import { UnixTime } from '@l2beat/shared-pure'
import { formatTimestamp } from '~/utils/dates'

export function isLivenessSynced(syncedUntil: UnixTime): boolean {
  const syncTarget = UnixTime.toStartOf(
    UnixTime.now() - UnixTime(6, 'hours'),
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
  return `Liveness data for this item is not synced since ${formatTimestamp(
    syncedUntil,
    {
      mode: 'datetime',
      longMonthName: true,
    },
  )}.`
}
