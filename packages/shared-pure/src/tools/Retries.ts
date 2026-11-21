import { assert } from './assert.js'

export type ShouldRetry = (
  attempts: number,
  error?: unknown,
) => {
  shouldStop: boolean
  notify: boolean
  executeAfter?: number
}

interface ExponentialBackOffOpts {
  stepMs: number
  maxAttempts: number
  maxDistanceMs: number
  notifyAfterAttempts: number
}

export function exponentialBackOff(opts: ExponentialBackOffOpts): ShouldRetry {
  const maxAttempts = opts.maxAttempts
  assert(maxAttempts > 0, 'maxAttempts needs to be a positive number')
  const maxDistanceMs = opts.maxDistanceMs
  assert(maxDistanceMs > 0, 'maxDistanceMs needs to be a positive number')
  const notifyAfterAttempts = opts.notifyAfterAttempts
  assert(
    notifyAfterAttempts > 0,
    'notifyAfterAttempts needs to be a positive number',
  )

  return (attempts: number) => {
    const distance = Math.pow(2, attempts) * opts.stepMs

    if (attempts === maxAttempts) {
      return {
        shouldStop: true,
        notify: false,
      }
    }

    return {
      shouldStop: false,
      notify: attempts > notifyAfterAttempts,
      executeAfter: Math.min(distance, maxDistanceMs),
    }
  }
}

export function maxAttempts(max: number): ShouldRetry {
  return (attempts) => {
    return {
      shouldStop: attempts >= max,
      notify: false,
    }
  }
}

function always(): ShouldRetry {
  return () => {
    return {
      shouldStop: false,
      notify: false,
    }
  }
}

export const Retries = {
  always,
  exponentialBackOff,
  maxAttempts,
}
