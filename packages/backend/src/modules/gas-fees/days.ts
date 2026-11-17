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
 *
 * Never a day before `firstDay`: an indexer starts no higher than its parents,
 * so one whose parent starts earlier is asked for days before its own first.
 */
export function nextDays(
  firstDay: UnixTime,
  from: number,
  to: number,
  maxDays = 1,
): UnixTime[] {
  const start = Math.max(from, firstDay + UnixTime.DAY)
  const first = UnixTime(
    UnixTime.toEndOf(UnixTime(start), 'day') - UnixTime.DAY,
  )
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

/** Dune loads a day at once and every read is billed, so an unfinished day is read again this often at most */
const UNFINISHED_REREAD_SECONDS = 6 * UnixTime.HOUR

/**
 * Remembers the day last found unfinished on Dune, so its retries don't each pay for a read.
 * In memory only: after a restart the day is read once more
 */
export class UnfinishedDay {
  private last:
    | { day: UnixTime; cause: Record<string, unknown>; readAt: UnixTime }
    | undefined

  constructor(private readonly message: string) {}

  /** Fails as before, without a read, when the day was found unfinished less than 6 hours ago */
  throwIfRecent(day: UnixTime, now: UnixTime): void {
    if (
      this.last?.day === day &&
      now < this.last.readAt + UNFINISHED_REREAD_SECONDS
    ) {
      throw new Error(this.message, { cause: this.last.cause })
    }
  }

  /** Whether the day was found unfinished by the read before this one */
  has(day: UnixTime): boolean {
    return this.last?.day === day
  }

  fail(day: UnixTime, now: UnixTime, cause: Record<string, unknown>): never {
    this.last = { day, cause, readAt: now }
    throw new Error(this.message, { cause })
  }

  clear(): void {
    this.last = undefined
  }
}
