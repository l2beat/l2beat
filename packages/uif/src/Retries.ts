import assert from 'node:assert'

export interface RetryStrategy {
  /** Returns true if the operation should be retried */
  shouldRetry: () => boolean
  /** Increments the number of attempts */
  markAttempt: () => void
  /** Returns the timeout in milliseconds */
  timeoutMs: () => number
  /** Resets the number of attempts */
  clear: () => void
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
  const maxTimeoutMs = opts.maxTimeoutMs ?? Infinity
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
  }
}

export const Retries = {
  exponentialBackOff,
}
