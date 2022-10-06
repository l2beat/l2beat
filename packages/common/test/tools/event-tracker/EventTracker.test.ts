import { expect } from 'earljs'
import { setTimeout } from 'timers/promises'

import { EventTracker } from '../../../src/tools/event-tracker/EventTracker'

describe(EventTracker.name, () => {
  it('has empty history by default', () => {
    const tracker = new EventTracker()
    expect(tracker.getHistory().size).toEqual(0)
  })

  it('records first event', () => {
    const tracker = new EventTracker()
    tracker.record()
    expect(tracker.getHistory().size).toEqual(1)
  })

  it('records subsequent events', async () => {
    const tracker = new EventTracker()
    tracker.record()
    await setTimeout(1000)
    tracker.record()
    expect(tracker.getHistory().size).toEqual(2)
  })

  it('prunes history before returning', async () => {
    const tracker = new EventTracker(0)
    tracker.record()
    tracker.record()
    tracker.record()
    await setTimeout(1000)
    expect(tracker.getHistory().size).toEqual(0)
  })
})
