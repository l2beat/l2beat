import { ShouldRetry } from './types'

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
  const maxDistanceMs = opts?.maxDistanceMs ?? Infinity

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
