import { assert } from './assert'

export type ShouldRetry<T> = (job: { task: T; attempts: number }) => {
  shouldStop: boolean
  notify: boolean
  executeAfter?: number
}

interface ExponentialBackOffOpts {
  stepMs: number
  maxAttempts: number // use Infinity for indefinite retries
  maxDistanceMs: number // use Infinity for unlimited distance
  attemptsNotificationThreshold: number // use Infinity to avoid notifications
}

export function exponentialBackOff<T>(
  opts: ExponentialBackOffOpts,
): ShouldRetry<T> {
  const maxAttempts = opts.maxAttempts
  assert(maxAttempts > 0, 'maxAttempts needs to be a positive number')
  const maxDistanceMs = opts.maxDistanceMs
  assert(maxDistanceMs > 0, 'maxDistanceMs needs to be a positive number')
  const attemptsNotificationThreshold = opts.attemptsNotificationThreshold
  assert(
    attemptsNotificationThreshold > 0,
    'attemptsNotificationThreshold needs to be a positive number',
  )

  return ({ attempts }: { attempts: number }) => {
    const distance = Math.pow(2, attempts) * opts.stepMs

    if (attempts === maxAttempts) {
      return {
        shouldStop: true,
        notify: attempts >= attemptsNotificationThreshold,
      }
    }

    return {
      shouldStop: false,
      notify: attempts >= attemptsNotificationThreshold,
      executeAfter: Math.min(distance, maxDistanceMs),
    }
  }
}

export function maxAttempts<T>(max: number): ShouldRetry<T> {
  return ({ attempts }) => {
    return {
      shouldStop: attempts >= max,
      notify: false,
    }
  }
}

function always<T>(): ShouldRetry<T> {
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
