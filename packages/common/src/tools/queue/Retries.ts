import { ShouldRetry } from './types'

function always() {
  return { retry: true }
}

function exponentialBackOff<T>(
  stepMs: number,
  maxAttempts = Infinity,
): ShouldRetry<T> {
  return ({ attempts }) => {
    if (attempts === maxAttempts) {
      return {
        retry: false,
      }
    }
    const distance = Math.pow(2, attempts) * stepMs
    return {
      retry: true,
      executeAfter: Date.now() + distance,
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
