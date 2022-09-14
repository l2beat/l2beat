import { ShouldRetry } from './types'

function always() {
  return { retry: true }
}

interface ExponentialBackOffOpts {
  maxAttempts?: number
  maxDistance?: number
}

function exponentialBackOff<T>(
  stepMs: number,
  opts?: ExponentialBackOffOpts,
): ShouldRetry<T> {
  const maxAttempts = opts?.maxAttempts ?? Infinity
  const maxDistance = opts?.maxDistance ?? Infinity

  return ({ attempts }) => {
    if (attempts === maxAttempts) {
      return {
        retry: false,
      }
    }
    const distance = Math.pow(2, attempts) * stepMs
    return {
      retry: true,
      executeAfter: Date.now() + Math.min(distance, maxDistance),
    }
  }
}

function maxAttempts<T>(max: number): ShouldRetry<T> {
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
