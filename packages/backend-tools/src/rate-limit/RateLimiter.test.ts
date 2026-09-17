import FakeTimers from '@sinonjs/fake-timers'
import { expect } from 'earl'

import { DEFAULT_RATE_LIMITER_LABEL, RateLimiter } from './RateLimiter'

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

  describe(RateLimiter.prototype.takeStats.name, () => {
    it('tracks wait, queue depth and dispatch per label', () => {
      // a non-zero start time lets the first call dispatch immediately
      const clock = FakeTimers.install({ now: 10_000 })
      // 1 call per second
      const rateLimiter = new RateLimiter({ callsPerMinute: 60 })

      let stats: ReturnType<RateLimiter['takeStats']>
      try {
        void rateLimiter.call(() => 1, 'a')
        void rateLimiter.call(() => 2, 'a')
        void rateLimiter.call(() => 3, 'a')
        void rateLimiter.call(() => 4, 'b')

        expect(rateLimiter.queueLength).toEqual(3)

        clock.tick(3_000)
        stats = rateLimiter.takeStats()
      } finally {
        clock.uninstall()
      }

      expect(stats.queueLength).toEqual(0)
      expect(stats.labels).toEqual({
        a: {
          enqueued: 3,
          dispatched: 3,
          // dispatched at t=0, t=1000, t=2000
          waitMsTotal: 3_000,
          waitMsMax: 2_000,
          // the first call was dispatched immediately, so at most two waited
          queueDepthMax: 2,
        },
        b: {
          enqueued: 1,
          dispatched: 1,
          waitMsTotal: 3_000,
          waitMsMax: 3_000,
          queueDepthMax: 3,
        },
      })
    })

    it('resets counters on every call', () => {
      const rateLimiter = new RateLimiter({ callsPerMinute: 100_000 })
      void rateLimiter.call(() => 1, 'a')

      expect(rateLimiter.takeStats().labels.a?.dispatched).toEqual(1)
      expect(rateLimiter.takeStats().labels).toEqual({})
    })

    it('uses a default label', () => {
      const rateLimiter = new RateLimiter({ callsPerMinute: 100_000 })
      void rateLimiter.call(() => 1)

      const stats = rateLimiter.takeStats()
      expect(Object.keys(stats.labels)).toEqual([DEFAULT_RATE_LIMITER_LABEL])
    })

    it('tracks in-flight calls', async () => {
      const rateLimiter = new RateLimiter({ callsPerMinute: 100_000 })
      let release: () => void = () => {}
      const blocked = new Promise<void>((resolve) => {
        release = resolve
      })

      const promiseA = rateLimiter.call(() => blocked)
      const promiseB = rateLimiter.call(() => blocked)
      // let the second call get past the spacing check
      await new Promise((resolve) => setTimeout(resolve, 5))

      const before = rateLimiter.takeStats()
      expect(before.inFlight).toEqual(2)
      expect(before.inFlightMax).toEqual(2)

      release()
      await Promise.all([promiseA, promiseB])
      // the in-flight counter is decremented after the caller is resolved
      await new Promise((resolve) => setTimeout(resolve, 0))

      const after = rateLimiter.takeStats()
      expect(after.inFlight).toEqual(0)
      // the max is reset to the in-flight count at the previous snapshot
      expect(after.inFlightMax).toEqual(2)
      expect(rateLimiter.takeStats().inFlightMax).toEqual(0)
    })
  })
})
