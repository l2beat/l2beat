import { UnixTime } from '@l2beat/shared-pure'
import { Retries, type RetryStrategy } from '@l2beat/uif'

/**
 * The days a daily indexer stores next, as their starts: those that end after
 * the height `from - 1` and by `to`, at most `maxDays`.
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
  const days: UnixTime[] = []
  for (
    let day = first;
    day + UnixTime.DAY <= lastEnd && days.length < maxDays;
    day = UnixTime(day + UnixTime.DAY)
  ) {
    days.push(day)
  }
  return days
}

/** Dune loads a day at once and every read is billed */
const REREAD_SECONDS = 6 * UnixTime.HOUR
/** The framework's limit: alerting needs a log line from an indexer every hour */
const MAX_RETRY_MS = 60 * 60_000

type Cause = Record<string, unknown>

/**
 * How an indexer waits for a day Dune hasn't got yet. In this framework an
 * indexer waits by failing its update, which is then retried. A wait is not a
 * failure, and this keeps the two apart:
 * - while waiting, the billed read is repeated every 6 hours at most, though
 *   the update is retried every hour;
 * - a wait stays out of the error log, which a failure enters at its tenth attempt.
 *
 * What it waits for is kept in memory: after a restart the day is read once more.
 */
export class DuneDayWait {
  private waiting: { day: UnixTime; cause: Cause; readAt: UnixTime } | undefined
  private lastWasWait = false
  private readonly failures = Retries.exponentialBackOff({
    // A failed read is billed too, so retries start slow
    initialTimeoutMs: 5 * 60_000,
    maxAttempts: Number.POSITIVE_INFINITY,
    maxTimeoutMs: MAX_RETRY_MS,
  })

  constructor(private readonly message: string) {}

  /** The indexer's `updateRetryStrategy` */
  readonly retryStrategy: RetryStrategy = {
    shouldRetry: () => this.failures.shouldRetry(),
    markAttempt: () => {
      if (!this.lastWasWait) this.failures.markAttempt()
    },
    timeoutMs: () =>
      this.lastWasWait ? MAX_RETRY_MS : this.failures.timeoutMs(),
    attempts: () => (this.lastWasWait ? 0 : this.failures.attempts()),
    clear: () => this.failures.clear(),
  }

  /**
   * Runs `read` for `day`, which calls `wait` when Dune hasn't got the day.
   * If the day was read less than 6 hours ago and wasn't there, waits again without reading.
   */
  async run<T>(
    day: UnixTime,
    now: UnixTime,
    read: (wait: (cause: Cause) => never) => Promise<T>,
  ): Promise<T> {
    const waiting = this.waiting
    if (waiting?.day === day && now < waiting.readAt + REREAD_SECONDS) {
      this.lastWasWait = true
      throw new Error(this.message, { cause: waiting.cause })
    }
    this.lastWasWait = false
    const result = await read((cause) => {
      this.waiting = { day, cause, readAt: now }
      this.lastWasWait = true
      throw new Error(this.message, { cause })
    })
    this.waiting = undefined
    return result
  }
}

/** Dune has a day within a day of its end */
const SETTLE_SECONDS = 3 * UnixTime.DAY

/**
 * Whether to stop waiting for Dune to have the whole of `day`. Until then an
 * indexer waits; after, it stores the day as what it is, partial or missing,
 * so the days after it aren't held back.
 */
export function isSettled(day: UnixTime, now: UnixTime): boolean {
  return now >= day + UnixTime.DAY + SETTLE_SECONDS
}
