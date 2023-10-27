import { assert } from './assert'

export type ShouldRetry<T> = (
  job: { task: T; attempts: number },
  error: unknown,
) => {
  retry: boolean
  notify: boolean
  executeAfter?: number
}

interface ExponentialBackOffOpts {
  stepMs: number
  maxAttempts: number // use Infinity for indefinite retries
  maxDistanceMs: number // use Infinity for unlimited distance
  notificationThresholdMs: number // use Infinity to avoid notifications
}

export function exponentialBackOff<T>(
  opts: ExponentialBackOffOpts,
): ShouldRetry<T> {
  const maxAttempts = opts.maxAttempts
  assert(maxAttempts > 0)
  const maxDistanceMs = opts.maxDistanceMs
  assert(maxDistanceMs > 0)
  const notificationThresholdMs = opts.notificationThresholdMs
  assert(notificationThresholdMs > 0)

  let totalRetryTimeMs = 0

  return ({ attempts }: { attempts: number }) => {
    const distance = Math.pow(2, attempts) * opts.stepMs
    totalRetryTimeMs += distance

    if (attempts === maxAttempts) {
      return {
        retry: false,
        notify: totalRetryTimeMs >= notificationThresholdMs,
      }
    }

    return {
      retry: true,
      notify: totalRetryTimeMs >= notificationThresholdMs,
      executeAfter: Math.min(distance, maxDistanceMs),
    }
  }
}

export function maxAttempts<T>(max: number): ShouldRetry<T> {
  return ({ attempts }) => {
    return {
      retry: attempts < max,
      notify: false,
    }
  }
}

function always<T>(): ShouldRetry<T> {
  return () => {
    return {
      retry: true,
      notify: false,
    }
  }
}

export const Retries = {
  always,
  exponentialBackOff,
  maxAttempts,
}
