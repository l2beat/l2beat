import FakeTimers from '@sinonjs/fake-timers'
import { expect } from 'earl'

import { RateLimiter } from './RateLimiter'

describe(RateLimiter.name, () => {
  const cases = [
    {
      name: 'one minute',
      callsPerMinute: 20,
      tick: 60_000,
      expectedCount: 20,
    },
    {
      name: 'three minutes',
      callsPerMinute: 5,
      tick: 180_000,
      expectedCount: 15,
    },
    {
      name: 'thirty seconds',
      callsPerMinute: 20,
      tick: 30_000,
      expectedCount: 10,
    },
  ]

  for (const { name, callsPerMinute, tick, expectedCount } of cases) {
    it(`enforces rate limits over ${name}`, () => {
      const clock = FakeTimers.install()

      let count = 0
      const rateLimiter = new RateLimiter({ callsPerMinute })
      for (let i = 0; i < 100; i++) {
        void rateLimiter.call(() => {
          count++
        })
      }

      clock.tick(tick)
      clock.uninstall()
      rateLimiter.clear()

      expect(count).toEqual(expectedCount)
    })
  }

  it('handles code that throws', async () => {
    const rateLimiter = new RateLimiter({ callsPerMinute: 10000 })
    const fn = () => {
      throw new Error('oops')
    }
    const promiseA = rateLimiter.call(fn)
    const promiseB = rateLimiter.call(fn)
    await expect(promiseA).toBeRejectedWith('oops')
    await expect(promiseB).toBeRejectedWith('oops')
  })
})
