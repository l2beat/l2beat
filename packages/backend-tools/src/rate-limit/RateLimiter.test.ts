import FakeTimers from '@sinonjs/fake-timers'
import { expect } from 'earl'

import {
  DEFAULT_RATE_LIMITER_LABEL,
  RateLimiter,
  type RateLimiterStepDown,
} from './RateLimiter'

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

  it('uses one wake-up timer while concurrent workers keep the queue busy', async () => {
    const clock = FakeTimers.install({ now: 10_000 })
    const rateLimiter = new RateLimiter({ callsPerMinute: 6_000 })
    const starts: number[] = []

    try {
      const workers = Array.from({ length: 6 }, async (_, worker) => {
        const results: number[] = []
        for (let i = 0; i < 100; i++) {
          results.push(
            await rateLimiter.call(() => {
              starts.push(Date.now())
              return worker * 100 + i
            }),
          )
        }
        return results
      })

      expect(clock.countTimers()).toEqual(1)
      for (let i = 0; i < 600; i++) {
        await clock.tickAsync(10)
        expect(clock.countTimers()).toBeLessThanOrEqual(1)
      }

      const results = (await Promise.all(workers)).flat()
      expect(results).toEqual(Array.from({ length: 600 }, (_, i) => i))
      expect(starts).toEqual(
        Array.from({ length: 600 }, (_, i) => 10_000 + i * 10),
      )
      expect(rateLimiter.queueLength).toEqual(0)
      expect(clock.countTimers()).toEqual(0)
    } finally {
      rateLimiter.clear()
      clock.uninstall()
    }
  })

  it('keeps dispatching queued calls while an earlier call is still in flight', async () => {
    const clock = FakeTimers.install({ now: 10_000 })
    const rateLimiter = new RateLimiter({ callsPerMinute: 6_000 })
    const starts: number[] = []
    let release = () => {}
    const blocked = new Promise<void>((resolve) => {
      release = resolve
    })

    try {
      const calls = [
        rateLimiter.call(() => {
          starts.push(Date.now())
          return blocked
        }),
        rateLimiter.call(() => {
          starts.push(Date.now())
          return blocked
        }),
        rateLimiter.call(() => {
          starts.push(Date.now())
          return blocked
        }),
      ]

      await clock.tickAsync(20)
      expect(starts).toEqual([10_000, 10_010, 10_020])
      expect(rateLimiter.takeStats().inFlight).toEqual(3)
      expect(clock.countTimers()).toEqual(0)

      release()
      await Promise.all(calls)
      await clock.tickAsync(0)
      expect(rateLimiter.takeStats().inFlight).toEqual(0)
    } finally {
      release()
      rateLimiter.clear()
      clock.uninstall()
    }
  })

  it('cancels the wake-up on clear and preserves spacing when reused', async () => {
    const clock = FakeTimers.install({ now: 10_000 })
    const rateLimiter = new RateLimiter({ callsPerMinute: 6_000 })
    const dispatched: string[] = []

    try {
      const first = rateLimiter.call(() => dispatched.push('first'))
      void rateLimiter.call(() => dispatched.push('discarded'))
      expect(clock.countTimers()).toEqual(1)

      rateLimiter.clear()
      expect(rateLimiter.queueLength).toEqual(0)
      expect(clock.countTimers()).toEqual(0)

      const next = rateLimiter.call(() => dispatched.push('next'))
      await clock.tickAsync(9)
      expect(dispatched).toEqual(['first'])
      await clock.tickAsync(1)
      await Promise.all([first, next])
      expect(dispatched).toEqual(['first', 'next'])
      expect(clock.countTimers()).toEqual(0)
    } finally {
      rateLimiter.clear()
      clock.uninstall()
    }
  })

  it('continues dispatching after synchronous throws and rejected promises', async () => {
    const clock = FakeTimers.install({ now: 10_000 })
    const rateLimiter = new RateLimiter({ callsPerMinute: 6_000 })

    try {
      const results = Promise.allSettled([
        rateLimiter.call(() => {
          throw new Error('sync failure')
        }),
        rateLimiter.call(() => Promise.reject(new Error('async failure'))),
        rateLimiter.call(() => 'success'),
      ])

      await clock.tickAsync(20)
      expect(await results).toEqual([
        { status: 'rejected', reason: new Error('sync failure') },
        { status: 'rejected', reason: new Error('async failure') },
        { status: 'fulfilled', value: 'success' },
      ])
      expect(rateLimiter.takeStats().inFlight).toEqual(0)
      expect(clock.countTimers()).toEqual(0)
    } finally {
      rateLimiter.clear()
      clock.uninstall()
    }
  })

  describe(RateLimiter.prototype.throttled.name, () => {
    it('keeps the rate when stepping down is not asked for', () => {
      const rateLimiter = new RateLimiter({ callsPerMinute: 600 })

      rateLimiter.throttled()

      expect(rateLimiter.effectiveCallsPerMinute).toEqual(600)
    })

    // The rate a limiter settles at is the number a person would otherwise
    // have to guess for the config. A burst of calls refused together is
    // one event, so it must lower the rate once, not once per call.
    it('lowers the rate by its step at most once a minute', async () => {
      const clock = FakeTimers.install({ now: 10_000 })
      const rateLimiter = new RateLimiter({
        callsPerMinute: 1_000,
        stepDownOnThrottle: 0.1,
      })

      try {
        rateLimiter.throttled()
        rateLimiter.throttled()
        rateLimiter.throttled()
        expect(rateLimiter.effectiveCallsPerMinute).toEqual(900)

        await rateLimiter.call(() => 'got through')
        clock.tick(59_000)
        rateLimiter.throttled()
        expect(rateLimiter.effectiveCallsPerMinute).toEqual(900)

        clock.tick(1_000)
        rateLimiter.throttled()
        expect(rateLimiter.effectiveCallsPerMinute).toEqual(810)
        expect(rateLimiter.callsPerMinute).toEqual(1_000)
      } finally {
        clock.uninstall()
      }
    })

    // Some providers lock an address out for minutes after one refusal and
    // refuse every call meanwhile, whatever the rate. Counting those would
    // settle the limiter far below the limit. Five refused minutes pass
    // here, then one call gets through and the next refusal counts again.
    it('waits for a call to get through before stepping down again', async () => {
      const clock = FakeTimers.install({ now: 10_000 })
      const rateLimiter = new RateLimiter({
        callsPerMinute: 1_000,
        stepDownOnThrottle: 0.1,
      })
      const refusedCall = () =>
        rateLimiter
          .call(() => {
            throw new Error('refused')
          })
          .catch(() => {})

      try {
        rateLimiter.throttled()
        for (let minute = 0; minute < 5; minute++) {
          clock.tick(60_000)
          await refusedCall()
          rateLimiter.throttled()
        }
        expect(rateLimiter.effectiveCallsPerMinute).toEqual(900)

        clock.tick(60_000)
        await rateLimiter.call(() => 'got through')
        rateLimiter.throttled()
        expect(rateLimiter.effectiveCallsPerMinute).toEqual(810)
      } finally {
        clock.uninstall()
      }
    })

    it('paces calls at the lowered rate', async () => {
      const clock = FakeTimers.install({ now: 10_000 })
      // one call every 100 ms, then every 200 ms
      const rateLimiter = new RateLimiter({
        callsPerMinute: 600,
        stepDownOnThrottle: 0.5,
      })
      const starts: number[] = []

      try {
        rateLimiter.throttled()
        for (let i = 0; i < 3; i++) {
          void rateLimiter.call(() => starts.push(Date.now()))
        }
        await clock.tickAsync(1_000)

        expect(starts).toEqual([10_000, 10_200, 10_400])
      } finally {
        rateLimiter.clear()
        clock.uninstall()
      }
    })

    // A 429 is not always about the rate. Refusals that never stop must
    // not grind a client down to nothing, and whoever reads the rate has to
    // be told it stopped at the floor and not at a limit. Ten refused
    // minutes, each after a call that got through: 1000, 500, 250, 125, 100.
    it('stops stepping down at a tenth of the configured rate, and says so', async () => {
      const clock = FakeTimers.install({ now: 10_000 })
      const steps: RateLimiterStepDown[] = []
      const rateLimiter = new RateLimiter({
        callsPerMinute: 1_000,
        stepDownOnThrottle: 0.5,
        onStepDown: (step) => steps.push(step),
      })

      try {
        for (let i = 0; i < 10; i++) {
          rateLimiter.throttled()
          clock.tick(60_000)
          await rateLimiter.call(() => 'got through')
        }

        expect(rateLimiter.effectiveCallsPerMinute).toEqual(100)
        expect(steps).toEqual([
          { from: 1_000, to: 500, atFloor: false },
          { from: 500, to: 250, atFloor: false },
          { from: 250, to: 125, atFloor: false },
          { from: 125, to: 100, atFloor: true },
        ])
      } finally {
        clock.uninstall()
      }
    })
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
