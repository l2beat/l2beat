import { expect } from 'earl'

import { exponentialBackOff, Retries } from './Retries'

describe('Retries', () => {
  describe(exponentialBackOff.name, () => {
    it('can respect max attempts', () => {
      const result = exponentialBackOff({
        stepMs: 100,
        maxAttempts: 1,
        maxDistanceMs: Infinity,
        notifyAfterAttempts: Infinity,
      })(1)
      expect(result).toEqual({
        shouldStop: true,
        notify: false,
      })
    })

    it('can respect max distance', () => {
      const result = exponentialBackOff({
        stepMs: 1000,
        maxAttempts: Infinity,
        maxDistanceMs: 200,
        notifyAfterAttempts: Infinity,
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
        notifyAfterAttempts: Infinity,
        maxDistanceMs: Infinity,
      })
      const results = [1, 2, 3, 4]
        .map((attempts) => shouldRetry(attempts))
        .map((r) => r.executeAfter)
      expect(results).toEqual([2, 4, 8, 16])
    })

    it('notification threshold works', () => {
      const shouldRetry = exponentialBackOff({
        stepMs: 1000,
        maxAttempts: Infinity,
        notifyAfterAttempts: 2,
        maxDistanceMs: Infinity,
      })
      const results = [1, 2, 3]
        .map((attempts) => shouldRetry(attempts))
        .map((r) => r.notify)

      expect(results).toEqual([false, false, true])
    })

    it('calculates initial distance at attempt 0', () => {
      const shouldRetry = exponentialBackOff({
        stepMs: 100,
        maxAttempts: 5,
        notifyAfterAttempts: Infinity,
        maxDistanceMs: Infinity,
      })

      expect(shouldRetry(0)).toEqual({
        shouldStop: false,
        notify: false,
        executeAfter: 100, 
      })
    })

    it('throws on invalid maxAttempts', () => {
      expect(() =>
        exponentialBackOff({
          stepMs: 100,
          maxAttempts: 0,
          maxDistanceMs: 1000,
          notifyAfterAttempts: 1,
        }),
      ).toThrow('maxAttempts needs to be a positive number')

      expect(() =>
        exponentialBackOff({
          stepMs: 100,
          maxAttempts: -1,
          maxDistanceMs: 1000,
          notifyAfterAttempts: 1,
        }),
      ).toThrow('maxAttempts needs to be a positive number')
    })

    it('throws on invalid maxDistanceMs', () => {
      expect(() =>
        exponentialBackOff({
          stepMs: 100,
          maxAttempts: 5,
          maxDistanceMs: 0,
          notifyAfterAttempts: 1,
        }),
      ).toThrow('maxDistanceMs needs to be a positive number')
    })

    it('throws on invalid notifyAfterAttempts', () => {
      expect(() =>
        exponentialBackOff({
          stepMs: 100,
          maxAttempts: 5,
          maxDistanceMs: 1000,
          notifyAfterAttempts: 0,
        }),
      ).toThrow('notifyAfterAttempts needs to be a positive number')
    })
  })

  describe(Retries.always.name, () => {
    it('never stops and never notifies', () => {
      const retry = Retries.always()
      expect(retry(0)).toEqual({ shouldStop: false, notify: false })
      expect(retry(1)).toEqual({ shouldStop: false, notify: false })
      expect(retry(100)).toEqual({ shouldStop: false, notify: false })
    })
  })
})
