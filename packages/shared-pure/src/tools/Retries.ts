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
  maxAttempts: number // use Infinity for indefinite retries
  maxDistanceMs: number // use Infinity for unlimited distance
  notifyAfterAttempts: number // use Infinity to avoid notifications
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
        notify: false, // no need to notify, the error after stop will be sent
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
