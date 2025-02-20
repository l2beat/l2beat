import { UnixTime } from '@l2beat/shared-pure'
import { formatTimestamp } from '~/utils/dates'

export function isThroughputSynced(syncedUntil: UnixTime): boolean {
  return UnixTime.now().add(-2, 'days').lte(syncedUntil)
}

export function getThroughputSyncWarning(
  syncedUntil: UnixTime,
  shorter?: boolean,
): string | undefined {
  if (isThroughputSynced(syncedUntil)) {
    return undefined
  }

  if (shorter) {
    return `Throughput data is not synced since ${formatTimestamp(
      syncedUntil.toNumber(),
      {
        mode: 'datetime',
        longMonthName: true,
      },
    )}.`
  }

  return `Throughput data for this item is not synced since ${formatTimestamp(
    syncedUntil.toNumber(),
    {
      mode: 'datetime',
      longMonthName: true,
    },
  )}.`
}
