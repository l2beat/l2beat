import { type InstalledClock, install } from '@sinonjs/fake-timers'
import { expect } from 'earl'

import { EventTracker } from './EventTracker'

describe(EventTracker.name, () => {
  let time: InstalledClock

  beforeEach(() => {
    time = install()
  })

  afterEach(() => {
    time.uninstall()
  })

  it('has empty history by default', () => {
    const tracker = new EventTracker()

    expect(tracker.getStatus()).toEqual({
      lastSecond: {},
      lastFiveSeconds: {},
      lastMinuteAverage: {},
      lastHourAverage: {},
    })
  })

  it('records event', () => {
    const tracker = new EventTracker()

    tracker.record('a')

    expect(tracker.getStatus()).toEqual({
      lastSecond: {
        a: 1,
      },
      lastFiveSeconds: {
        a: 1,
      },
      lastMinuteAverage: {
        a: 1 / 60,
      },
      lastHourAverage: {
        a: 1 / 3_600,
      },
    })
  })

  it('groups event', async () => {
    const tracker = new EventTracker()

    tracker.record('a')
    tracker.record('b')
    time.tick(1000 * 60 * 30)
    tracker.record('b')
    tracker.record('b')
    tracker.record('c')
    time.tick(1000)
    tracker.record('c')

    expect(tracker.getStatus()).toEqual({
      lastSecond: {
        c: 1,
      },
      lastFiveSeconds: {
        b: 2,
        c: 2,
      },
      lastMinuteAverage: {
        b: 2 / 60,
        c: 2 / 60,
      },
      lastHourAverage: {
        a: 1 / 3_600,
        b: 3 / 3_600,
        c: 2 / 3_600,
      },
    })
  })

  it('prunes history before returning', () => {
    const historySize = 1000
    const tracker = new EventTracker(historySize)

    tracker.record('a')
    tracker.record('b')
    tracker.record('c')
    time.tick(historySize)
    tracker.record('d')

    expect(tracker.getStatus()).toEqual({
      lastSecond: {
        d: 1,
      },
      lastFiveSeconds: {
        d: 1,
      },
      lastMinuteAverage: {
        d: 1 / 60,
      },
      lastHourAverage: {
        d: 1 / 3_600,
      },
    })
  })

  it('prunes history on interval', () => {
    const historySize = 100
    const tracker = new EventTracker(historySize)

    tracker.record('a')
    tracker.record('b')
    tracker.record('c')

    expect(tracker.getEventsCount()).toEqual(3)

    time.tick(historySize)

    expect(tracker.getEventsCount()).toEqual(0)

    tracker.record('d')
    tracker.record('e')

    expect(tracker.getEventsCount()).toEqual(2)

    time.tick(historySize)

    expect(tracker.getEventsCount()).toEqual(0)
  })
})
