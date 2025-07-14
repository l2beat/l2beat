import { assert } from '@l2beat/shared-pure'

export interface RetryStrategy {
  /** Returns true if the operation should be retried */
  shouldRetry: () => boolean
  /** Increments the number of attempts */
  markAttempt: () => void
  /** Returns the timeout in milliseconds */
  timeoutMs: () => number
  /** Resets the number of attempts */
  clear: () => void
  /** Get amount of attempts */
  attempts: () => number
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

export const Retries = {
  exponentialBackOff,
}
