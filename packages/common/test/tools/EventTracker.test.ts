import { expect } from 'earljs'
import { setTimeout } from 'timers/promises'

import { EventTracker } from '../../src/tools/EventTracker'

describe(EventTracker.name, () => {
  it('has empty history by default', () => {
    const tracker = new EventTracker()
    expect(tracker.getStats()).toEqual({
      lastSecond: {},
      lastMinuteAverage: {},
      lastHourAverage: {},
    })
  })

  it('records event', () => {
    const tracker = new EventTracker()
    tracker.record('something')
    expect(tracker.getStats()).toEqual({
      lastSecond: {
        something: 1,
      },
      lastMinuteAverage: {
        something: 1 / 60,
      },
      lastHourAverage: {
        something: 1 / 3_600,
      },
    })
  })

  it('groups event', async () => {
    const tracker = new EventTracker()
    tracker.record('a')
    tracker.record('b')
    await setTimeout(1001)
    tracker.record('b')
    expect(tracker.getStats()).toEqual({
      lastSecond: {
        b: 1,
      },
      lastMinuteAverage: {
        a: 1 / 60,
        b: 2 / 60,
      },
      lastHourAverage: {
        a: 1 / 3_600,
        b: 2 / 3_600,
      },
    })
  })

  it('prunes history before returning', async () => {
    const tracker = new EventTracker(10)
    tracker.record('a')
    tracker.record('b')
    tracker.record('c')
    await setTimeout(100)
    expect(tracker.getStats()).toEqual({
      lastSecond: {},
      lastMinuteAverage: {},
      lastHourAverage: {},
    })
  })
})
