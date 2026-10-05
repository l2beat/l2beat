import { UnixTime } from '@l2beat/shared-pure'

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
