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
  stepMs: number
  maxAttempts: number // use Infinity for indefinite retries
  maxDistanceMs?: number
}

export function exponentialBackOff(opts: ExponentialBackOffOpts) {
  const maxAttempts = opts.maxAttempts
  assert(maxAttempts > 0)
  const maxDistanceMs = opts.maxDistanceMs ?? Infinity
  assert(maxDistanceMs > 0)

  return ({ attempts }: { attempts: number }) => {
    if (attempts === maxAttempts) {
      return {
        retry: false,
      }
    }
    const distance = Math.pow(2, attempts) * opts.stepMs
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
