import { assert } from './assert'

export type ShouldRetry<T> = (
  job: { task: T; attempts: number },
  error: unknown,
) => {
  retry: boolean
  executeAfter?: number
}

function always() {
  return { retry: true }
}

interface ExponentialBackOffOpts {
  maxAttempts?: number
  maxDistanceMs?: number
}

export function exponentialBackOff(
  stepMs: number,
  opts?: ExponentialBackOffOpts,
) {
  const maxAttempts = opts?.maxAttempts ?? Infinity
  assert(maxAttempts > 0)
  const maxDistanceMs = opts?.maxDistanceMs ?? Infinity
  assert(maxDistanceMs > 0)

  return ({ attempts }: { attempts: number }) => {
    if (attempts === maxAttempts) {
      return {
        retry: false,
      }
    }
    const distance = Math.pow(2, attempts) * stepMs
    return {
      retry: true,
      executeAfter: Math.min(distance, maxDistanceMs),
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
}
