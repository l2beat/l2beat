import { UnixTime } from '@l2beat/shared-pure'
import { formatTimestamp } from '~/utils/dates'

export function isThroughputSynced(syncedUntil: UnixTime): boolean {
  return UnixTime.now().add(-2, 'days').lte(syncedUntil)
}

export function getThroughputSyncWarning(
  syncedUntil: UnixTime,
): string | undefined {
  if (isThroughputSynced(syncedUntil)) {
    return undefined
  }

  return `Throughput data for this item is not synced since ${formatTimestamp(
    syncedUntil.toNumber(),
    {
      mode: 'datetime',
      longMonthName: true,
    },
  )}.`
}
