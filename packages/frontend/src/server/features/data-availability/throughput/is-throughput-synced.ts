import { UnixTime } from '@l2beat/shared-pure'
import { formatTimestamp } from '~/utils/dates'

export function isThroughputSynced(syncedUntil: UnixTime): boolean {
  return UnixTime.now() - 2 * UnixTime.DAY <= syncedUntil
}

export function getThroughputSyncWarning(
  syncedUntil: UnixTime,
  opts?: { shorter?: boolean },
): string | undefined {
  if (isThroughputSynced(syncedUntil)) {
    return undefined
  }

  if (opts?.shorter) {
    return `Throughput data is not synced since ${formatTimestamp(syncedUntil, {
      mode: 'datetime',
      longMonthName: true,
    })}.`
  }

  return `Throughput data for this item is not synced since ${formatTimestamp(
    syncedUntil,
    {
      mode: 'datetime',
      longMonthName: true,
    },
  )}.`
}
