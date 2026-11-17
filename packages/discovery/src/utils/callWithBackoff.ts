import { assert, Retries } from '@l2beat/shared-pure'

export const BACKOFF_ATTEMPTS_MAX = 10
// Why capped: uncapped, the waits summed to 34 minutes, longer than the update
// monitor's 20 minute task timeout. Capped they sum to at most 6 minutes.
export const BACKOFF_WAIT_MS_MAX = 60_000

const shouldRetry = Retries.exponentialBackOff({
  stepMs: 2000, // 4s, 8s, 16s, 32s, then 60s five times
  maxAttempts: BACKOFF_ATTEMPTS_MAX,
  maxDistanceMs: BACKOFF_WAIT_MS_MAX,
  notifyAfterAttempts: Number.POSITIVE_INFINITY,
})

export interface BackoffOptions {
  /** Returns a number in [0, 1), like Math.random. */
  random: () => number
  isPermanentError: (error: unknown) => boolean
  retryCallback: (attempts: number, error: unknown) => void
}

export async function callWithBackoff<T>(
  call: () => Promise<T>,
  options: BackoffOptions,
): Promise<T> {
  for (let attempts = 1; attempts <= BACKOFF_ATTEMPTS_MAX; attempts++) {
    try {
      return await call()
    } catch (error) {
      if (options.isPermanentError(error)) {
        throw error
      }
      const result = shouldRetry(attempts, error)
      if (result.shouldStop) {
        throw error
      }
      assert(result.executeAfter !== undefined, 'Retry without a wait')
      const waitMs = jitteredWaitMs(result.executeAfter, options.random())
      options.retryCallback(attempts, error)
      await new Promise((resolve) => setTimeout(resolve, waitMs))
    }
  }
  assert(false, 'Backoff loop ended without returning or throwing')
}

// Full jitter, so that parallel discovery runs do not retry in lockstep.
function jitteredWaitMs(waitMsMax: number, randomFraction: number): number {
  assert(waitMsMax > 0, 'Wait must be positive')
  assert(waitMsMax <= BACKOFF_WAIT_MS_MAX, 'Wait exceeds the cap')
  assert(randomFraction >= 0, 'Random fraction below 0')
  assert(randomFraction <= 1, 'Random fraction above 1')
  return Math.floor(waitMsMax * randomFraction)
}

// Why 408 and 429 stay retryable: a request timeout and a rate limit both pass
// with time, while every other 4xx says the request itself is wrong.
export function isPermanentHttpError(error: unknown): boolean {
  const status = httpStatusOf(error)
  if (status === undefined) {
    return false
  }
  if (status < 400 || status >= 500) {
    return false
  }
  return status !== 408 && status !== 429
}

function httpStatusOf(error: unknown): number | undefined {
  if (!(error instanceof Error)) {
    return undefined
  }
  const cause = error.cause
  if (typeof cause !== 'object' || cause === null) {
    return undefined
  }
  const status = (cause as { status?: unknown }).status
  return typeof status === 'number' ? status : undefined
}
