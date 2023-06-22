import { expect } from 'earl'

import { exponentialBackOff } from './Retries'

describe('Retries', () => {
  describe(exponentialBackOff.name, () => {
    it('can respect max attempts', () => {
      const result = exponentialBackOff({ stepMs: 100, maxAttempts: 1 })({
        attempts: 1,
      })
      expect(result.retry).toEqual(false)
    })

    it('can respect max distance', () => {
      const result = exponentialBackOff({
        stepMs: 100,
        maxAttempts: Infinity,
        maxDistanceMs: 200,
      })({
        attempts: 1,
      })
      expect(result).toEqual({ retry: true, executeAfter: 200 })
    })

    it('can calculate distance properly', () => {
      const shouldRetry = exponentialBackOff({ stepMs: 1, maxAttempts: 5 })
      const results = [1, 2, 3, 4]
        .map((attempts) => shouldRetry({ attempts }))
        .map((r) => r.executeAfter)
      expect(results).toEqual([2, 4, 8, 16])
    })
  })
})
