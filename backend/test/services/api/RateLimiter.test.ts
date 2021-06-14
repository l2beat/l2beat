import FakeTimers from '@sinonjs/fake-timers'
import { expect } from 'chai'
import { RateLimiter } from '../../../src/api/RateLimiter'

describe('RateLimiter', () => {
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
    it(`enforces rate limits over ${name}`, async () => {
      const clock = FakeTimers.install()

      let count = 0
      const rateLimiter = new RateLimiter({ callsPerMinute })
      for (let i = 0; i < 100; i++) {
        rateLimiter.call(() => {
          count++
        })
      }

      clock.tick(tick)
      clock.uninstall()
      rateLimiter.clear()

      expect(count).to.equal(expectedCount)
    })
  }
})
