import { describe, expect, it, vi } from 'vitest'

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
      // The counts above are the ones a limiter starting at the epoch
      // produces: at time 0 the first call waits instead of dispatching.
      vi.useFakeTimers()
      vi.setSystemTime(0)

      let count = 0
      const rateLimiter = new RateLimiter({ callsPerMinute })
      for (let i = 0; i < 100; i++) {
        void rateLimiter.call(() => {
          count++
        })
      }

      vi.advanceTimersByTime(tick)
      vi.useRealTimers()
      rateLimiter.clear()

      expect(count).toStrictEqual(expectedCount)
    })
  }

  it('handles code that throws', async () => {
    const rateLimiter = new RateLimiter({ callsPerMinute: 10000 })
    const fn = () => {
      throw new Error('oops')
    }
    const promiseA = rateLimiter.call(fn)
    const promiseB = rateLimiter.call(fn)
    await expect(promiseA).rejects.toThrow('oops')
    await expect(promiseB).rejects.toThrow('oops')
  })

  describe(RateLimiter.prototype.takeStats.name, () => {
    it('tracks wait, queue depth and dispatch per label', () => {
      // a non-zero start time lets the first call dispatch immediately
      vi.useFakeTimers()
      vi.setSystemTime(10_000)
      // 1 call per second
      const rateLimiter = new RateLimiter({ callsPerMinute: 60 })

      let stats: ReturnType<RateLimiter['takeStats']>
      try {
        void rateLimiter.call(() => 1, 'a')
        void rateLimiter.call(() => 2, 'a')
        void rateLimiter.call(() => 3, 'a')
        void rateLimiter.call(() => 4, 'b')

        expect(rateLimiter.queueLength).toStrictEqual(3)

        vi.advanceTimersByTime(3_000)
        stats = rateLimiter.takeStats()
      } finally {
        vi.useRealTimers()
      }

      expect(stats.queueLength).toStrictEqual(0)
      expect(stats.labels).toStrictEqual({
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

      expect(rateLimiter.takeStats().labels.a?.dispatched).toStrictEqual(1)
      expect(rateLimiter.takeStats().labels).toStrictEqual({})
    })

    it('uses a default label', () => {
      const rateLimiter = new RateLimiter({ callsPerMinute: 100_000 })
      void rateLimiter.call(() => 1)

      const stats = rateLimiter.takeStats()
      expect(Object.keys(stats.labels)).toStrictEqual([
        DEFAULT_RATE_LIMITER_LABEL,
      ])
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
      expect(before.inFlight).toStrictEqual(2)
      expect(before.inFlightMax).toStrictEqual(2)

      release()
      await Promise.all([promiseA, promiseB])
      // the in-flight counter is decremented after the caller is resolved
      await new Promise((resolve) => setTimeout(resolve, 0))

      const after = rateLimiter.takeStats()
      expect(after.inFlight).toStrictEqual(0)
      // the max is reset to the in-flight count at the previous snapshot
      expect(after.inFlightMax).toStrictEqual(2)
      expect(rateLimiter.takeStats().inFlightMax).toStrictEqual(0)
    })
  })
})
