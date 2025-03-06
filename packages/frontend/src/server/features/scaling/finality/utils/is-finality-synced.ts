import { UnixTime } from '@l2beat/shared-pure'
import { formatTimestamp } from '~/utils/dates'

export function isFinalitySynced(syncedUntil: number): boolean {
  return UnixTime.now() - 1 * UnixTime.DAY - 1 * UnixTime.HOUR <= syncedUntil
}

export function getFinalitySyncWarning(
  syncedUntil: number,
): string | undefined {
  if (isFinalitySynced(syncedUntil)) {
    return undefined
  }

  return `Finality data for this item is not synced since ${formatTimestamp(
    syncedUntil,
    {
      mode: 'datetime',
      longMonthName: true,
    },
  )}.`
}
