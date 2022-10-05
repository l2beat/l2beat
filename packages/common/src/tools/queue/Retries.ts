import { ShouldRetry } from './types'

function always() {
  return { retry: true }
}

interface ExponentialBackOffOpts {
  maxAttempts?: number
  maxDistance?: number
}

export function exponentialBackOff(
  stepMs: number,
  opts?: ExponentialBackOffOpts,
) {
  const maxAttempts = opts?.maxAttempts ?? Infinity
  const maxDistance = opts?.maxDistance ?? Infinity

  return ({ attempts }: { attempts: number }) => {
    if (attempts === maxAttempts) {
      return {
        retry: false,
      }
    }
    const distance = Math.pow(2, attempts) * stepMs
    return {
      retry: true,
      executeAfter: Math.min(distance, maxDistance),
    }
  }
}

export function maxAttempts<T>(max: number): ShouldRetry<T> {
  return ({ attempts }) => {
    return {
      retry: attempts < max,
    }
  }
}

export const Retries = {
  always,
  exponentialBackOff,
  maxAttempts,
  // never drops failing tasks
  defaultExponentialBackOff: exponentialBackOff(100, {
    maxDistance: 3_000,
  }),
  // drops failing tasks after few retries
  defaultExponentialBackOffAndDrop: exponentialBackOff(100, {
    maxDistance: 3_000,
    maxAttempts: 8,
  }),
}
