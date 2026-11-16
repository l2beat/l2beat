import { assert } from '@l2beat/shared-pure'

export interface RetryStrategy {
  /** Returns true if the operation should be retried */
  shouldRetry: () => boolean
  /** Increments the number of attempts */
  markAttempt: (error?: unknown) => void
  /** Returns the timeout in milliseconds */
  timeoutMs: () => number
  /** Resets the number of attempts */
  clear: () => void
  /** Get amount of attempts */
  attempts: () => number
  /**
   * True when the last attempt failed with an expected wait, e.g. data that
   * is not published yet. The indexer logs it as a wait, not a failure.
   */
  isWaiting?: () => boolean
}

interface ExponentialBackOffOpts {
  initialTimeoutMs: number
  maxAttempts: number
  maxTimeoutMs?: number
}

/**
 * @param opts.maxAttempts - use Infinity for indefinite retries
 * @param opts.initialTimeoutMs - initial timeout by 2**attempts gives the timeout
 * @param opts.maxTimeoutMs - maximum timeout between retries (default: Infinity)
 */
function exponentialBackOff(opts: ExponentialBackOffOpts): RetryStrategy {
  let attempts = 0
  const maxAttempts = opts.maxAttempts
  assert(maxAttempts > 0)
  const maxTimeoutMs = opts.maxTimeoutMs ?? Number.POSITIVE_INFINITY
  assert(maxTimeoutMs > 0)

  return {
    shouldRetry: () => {
      return attempts <= maxAttempts
    },
    markAttempt: () => {
      attempts++
    },
    timeoutMs: () => {
      const timeout = Math.pow(2, attempts - 1) * opts.initialTimeoutMs
      return Math.min(timeout, maxTimeoutMs)
    },
    clear: () => {
      attempts = 0
    },
    attempts: () => attempts,
  }
}

interface ExpectedWaitOpts {
  /** Returns true for errors that mean the data will be there soon */
  isExpected: (error: unknown) => boolean
  /** Fixed timeout between attempts while waiting */
  intervalMs: number
  /** Strategy for every other error */
  otherwise: RetryStrategy
}

/**
 * Retries expected waits at a fixed interval, indefinitely, and leaves every
 * other error to `otherwise`. The two keep separate attempt counts, so a long
 * wait does not push the next real error to the maximum back-off.
 */
function withExpectedWait(opts: ExpectedWaitOpts): RetryStrategy {
  assert(opts.intervalMs > 0)
  let waitAttempts = 0
  let waiting = false

  return {
    shouldRetry: () => waiting || opts.otherwise.shouldRetry(),
    markAttempt: (error?: unknown) => {
      waiting = opts.isExpected(error)
      if (waiting) {
        waitAttempts++
      } else {
        opts.otherwise.markAttempt(error)
      }
    },
    timeoutMs: () => (waiting ? opts.intervalMs : opts.otherwise.timeoutMs()),
    clear: () => {
      waitAttempts = 0
      waiting = false
      opts.otherwise.clear()
    },
    attempts: () => (waiting ? waitAttempts : opts.otherwise.attempts()),
    isWaiting: () => waiting,
  }
}

export const Retries = {
  exponentialBackOff,
  withExpectedWait,
}
