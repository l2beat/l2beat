import { expect } from 'earl'

import { exponentialBackOff } from './Retries'

describe('Retries', () => {
  describe(exponentialBackOff.name, () => {
    it('can respect max attempts', () => {
      const result = exponentialBackOff({
        stepMs: 100,
        maxAttempts: 1,
        maxDistanceMs: Number.POSITIVE_INFINITY,
        notifyAfterAttempts: Number.POSITIVE_INFINITY,
      })(1)
      expect(result.shouldStop).toEqual(true)
    })

    it('can respect max distance', () => {
      const result = exponentialBackOff({
        stepMs: 1000,
        maxAttempts: Number.POSITIVE_INFINITY,
        maxDistanceMs: 200,
        notifyAfterAttempts: Number.POSITIVE_INFINITY,
      })(1)
      expect(result).toEqual({
        shouldStop: false,
        executeAfter: 200,
        notify: false,
      })
    })

    it('can calculate distance properly', () => {
      const shouldRetry = exponentialBackOff({
        stepMs: 1,
        maxAttempts: 5,
        notifyAfterAttempts: Number.POSITIVE_INFINITY,
        maxDistanceMs: Number.POSITIVE_INFINITY,
      })
      const results = [1, 2, 3, 4]
        .map((attempts) => shouldRetry(attempts))
        .map((r) => r.executeAfter)
      expect(results).toEqual([2, 4, 8, 16])
    })

    it('notification threshold works', () => {
      const shouldRetry = exponentialBackOff({
        stepMs: 1000,
        maxAttempts: Number.POSITIVE_INFINITY,
        notifyAfterAttempts: 2,
        maxDistanceMs: Number.POSITIVE_INFINITY,
      })
      const results = [1, 2, 3]
        .map((attempts) => shouldRetry(attempts))
        .map((r) => r.notify)

      expect(results).toEqual([false, false, true])
    })
  })
})
