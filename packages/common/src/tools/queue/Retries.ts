import { ShouldRetry } from './types'

function always() {
  return true
}

function exponentialBackOff<T>(stepMs: number): ShouldRetry<T> {
  return ({ attempts }) => {
    const distance = Math.pow(2, attempts) * stepMs
    return Date.now() + distance
  }
}

function maxAttempts<T>(max: number): ShouldRetry<T> {
  return ({ attempts }) => {
    return attempts < max
  }
}

export const Retries = {
  always,
  exponentialBackOff,
  maxAttempts,
}
