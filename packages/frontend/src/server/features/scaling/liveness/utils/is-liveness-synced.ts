import { UnixTime } from '@l2beat/shared-pure'
import { formatTimestamp } from '~/utils/dates'

export function isLivenessSynced(syncedUntil: UnixTime): boolean {
  const syncTarget = UnixTime.now().add(-6, 'hours').toStartOf('hour')
  return syncTarget.lte(syncedUntil)
}

export function getLivenessSyncWarning(
  syncedUntil: UnixTime,
): string | undefined {
  if (isLivenessSynced(syncedUntil)) {
    return undefined
  }
  return `Liveness data for this item is not synced since ${formatTimestamp(
    syncedUntil.toNumber(),
    {
      mode: 'datetime',
      longMonthName: true,
    },
  )}.`
}
