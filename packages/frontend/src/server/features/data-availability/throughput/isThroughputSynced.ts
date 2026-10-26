import { UnixTime } from '@l2beat/shared-pure'
import { formatTimestamp } from '~/utils/dates'

export function isThroughputSynced({
  syncedUntil,
  pastDaySynced,
  to,
}: {
  syncedUntil: UnixTime
  pastDaySynced: boolean
  to: UnixTime
}): boolean {
  return (
    syncedUntil >=
    (pastDaySynced
      ? UnixTime.toStartOf(to, 'day') - UnixTime.HOUR
      : UnixTime.toStartOf(to, 'hour') - 6 * UnixTime.HOUR)
  )
}

export function getThroughputSyncWarning(
  syncedUntil: UnixTime,
): string | undefined {
  if (
    isThroughputSynced({
      syncedUntil,
      pastDaySynced: false,
      to: UnixTime.now(),
    })
  ) {
    return undefined
  }
  return `No throughput data since ${formatTimestamp(syncedUntil, {
    mode: 'datetime',
    longMonthName: true,
  })}.`
}
