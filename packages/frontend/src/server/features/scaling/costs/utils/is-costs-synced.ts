import { UnixTime } from '@l2beat/shared-pure'
import { formatTimestamp } from '~/utils/dates'

export function isCostsSynced(syncedUntil: UnixTime): boolean {
  return UnixTime.now().add(-1, 'days').add(-1, 'hours').lte(syncedUntil)
}

export function getCostsSyncWarning(syncedUntil: UnixTime): string | undefined {
  if (isCostsSynced(syncedUntil)) {
    return undefined
  }

  return `Costs data for this item is not synced since ${formatTimestamp(
    syncedUntil.toNumber(),
    {
      mode: 'datetime',
      longMonthName: true,
    },
  )}.`
}
