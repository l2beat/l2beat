import { UnixTime } from '@l2beat/shared-pure'
import { formatTimestamp } from '~/utils/dates'

export function isThroughputSynced(
  syncedUntil: UnixTime,
  pastDaySynced: boolean,
): boolean {
  return (
    syncedUntil >=
    (pastDaySynced
      ? UnixTime.toStartOf(UnixTime.now(), 'day') - UnixTime.HOUR
      : UnixTime.toStartOf(UnixTime.now(), 'hour') - 6 * UnixTime.HOUR)
  )
}

export function getThroughputSyncWarning(
  syncedUntil: UnixTime,
  opts?: { shorter?: boolean; pastDaySynced?: boolean },
): string | undefined {
  if (isThroughputSynced(syncedUntil, opts?.pastDaySynced ?? false)) {
    return undefined
  }

  if (opts?.shorter) {
    return `No throughput data since ${formatTimestamp(syncedUntil, {
      mode: 'datetime',
      longMonthName: true,
    })}.`
  }

  return `No throughput data since ${formatTimestamp(syncedUntil, {
    mode: 'datetime',
    longMonthName: true,
  })}.`
}
