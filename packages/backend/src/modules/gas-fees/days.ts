import { UnixTime } from '@l2beat/shared-pure'
import { Retries } from '@l2beat/uif'

/**
 * A failed Dune read is billed too, so retries start slow. Never more than an
 * hour apart, as alerting needs a log line every hour.
 */
export function duneRetryStrategy() {
  return Retries.exponentialBackOff({
    initialTimeoutMs: 5 * 60_000,
    maxAttempts: Number.POSITIVE_INFINITY,
    maxTimeoutMs: 60 * 60_000,
  })
}

/**
 * The days a daily indexer stores next, as their starts: those that end after
 * the height `from - 1` and by `to`, at most `maxDays`, in one calendar month.
 * A height is a day boundary at or after the end of the last stored day.
 */
export function nextDays(from: number, to: number, maxDays = 1): UnixTime[] {
  const first = UnixTime(UnixTime.toEndOf(UnixTime(from), 'day') - UnixTime.DAY)
  const lastEnd = UnixTime.toStartOf(UnixTime(to), 'day')
  const month = UnixTime.toDate(first).getUTCMonth()
  const days: UnixTime[] = []
  for (
    let day = first;
    day + UnixTime.DAY <= lastEnd &&
    days.length < maxDays &&
    UnixTime.toDate(day).getUTCMonth() === month;
    day = UnixTime(day + UnixTime.DAY)
  ) {
    days.push(day)
  }
  return days
}
