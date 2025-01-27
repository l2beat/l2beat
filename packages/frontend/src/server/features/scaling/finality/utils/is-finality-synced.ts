import { UnixTime } from '@l2beat/shared-pure'
import { formatTimestamp } from '~/utils/dates'

export function isFinalitySynced(syncedUntil: number): boolean {
  return (
    UnixTime.now().add(-1, 'days').add(-1, 'hours').toNumber() <= syncedUntil
  )
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
