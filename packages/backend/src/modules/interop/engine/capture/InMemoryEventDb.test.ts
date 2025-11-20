import { expect } from 'earl'
import { createInteropEventType } from '../../plugins/types'
import { InMemoryEventDb } from './InMemoryEventDb'

describe(InMemoryEventDb.name, () => {
  const EventA = createInteropEventType<{ a: string }>('a.Event')
  const EventB = createInteropEventType<{ b1: string; b2: number }>('b.Event')

  it('can return a list of events', () => {
    const db = new InMemoryEventDb()
    const events = [
      EventA.mock({ a: 'one' }),
      EventA.mock({ a: 'two' }),
      EventB.mock({ b1: 'b1', b2: 0xb2 }),
    ]
    events.forEach((e) => db.addEvent(e))

    expect(db.getEvents(EventA.type)).toEqual([events[0], events[1]])
    expect(db.getEvents(EventB.type)).toEqual([events[2]])
  })

  it('can query for a specific event', () => {
    const db = new InMemoryEventDb()
    const events = [
      EventA.mock({ a: 'one' }),
      EventA.mock({ a: 'two' }),
      EventA.mock({ a: 'three' }),
    ]
    events.forEach((e) => db.addEvent(e))

    expect(db.find(EventA, { a: 'three' })).toEqual(events[2])
    expect(db.find(EventA, { a: 'four' })).toEqual(undefined)
  })

  it('can remove an event', () => {
    const db = new InMemoryEventDb()
    const events = [
      EventA.mock({ a: 'one' }),
      EventA.mock({ a: 'two' }),
      EventA.mock({ a: 'three' }),
    ]
    events.forEach((e) => db.addEvent(e))

    db.removeEvents(new Set([events[0].eventId]))

    expect(db.find(EventA, { a: 'one' })).toEqual(undefined)
  })

  it('can remove expired events', () => {
    const db = new InMemoryEventDb()
    const events = [
      EventA.mock({ a: 'one' }, 8),
      EventA.mock({ a: 'two' }, 9),
      EventA.mock({ a: 'three' }, 11),
    ]
    events.forEach((e) => db.addEvent(e))

    db.removeExpired(10)

    expect(db.getEvents(EventA.type)).toEqual([events[2]])
  })
})
