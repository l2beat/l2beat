import FakeTimers from '@sinonjs/fake-timers'
import { expect } from 'earljs'

import { RequestTracker } from '../../src/tools/RequestTracker'

describe('RequestTracker', () => {
  it('tracks requests', () => {
    const clock = FakeTimers.install({ now: 0 })

    const requestTracker = new RequestTracker(4)

    expect(requestTracker.getStats()).toEqual({
      lastUpdatedAt: '1970-01-01T00:00:00.000Z',
      lifetimeAverageResponseTimeMs: 0,
      lifetimeErrorRate: '0.00%',
      lifetimeErrors: 0,
      lifetimeRequests: 0,
      recentAverageResponseTimeMs: 0,
      recentErrorRate: '0.00%',
      recentErrors: 0,
      recentRequests: 0,
    })

    // lifetime
    requestTracker.add(10, true)
    requestTracker.add(10, true)
    requestTracker.add(30, false)
    requestTracker.add(10, true)
    requestTracker.add(20, true)

    // recent
    requestTracker.add(10, false)
    requestTracker.add(20, true)
    requestTracker.add(30, true)
    clock.tick(12345)
    requestTracker.add(40, false)

    clock.uninstall()

    expect(requestTracker.getStats()).toEqual({
      lastUpdatedAt: '1970-01-01T00:00:12.345Z',
      lifetimeAverageResponseTimeMs: 20,
      lifetimeErrorRate: '33.33%',
      lifetimeErrors: 3,
      lifetimeRequests: 9,
      recentAverageResponseTimeMs: 25,
      recentErrorRate: '50.00%',
      recentErrors: 2,
      recentRequests: 4,
    })
  })
})
