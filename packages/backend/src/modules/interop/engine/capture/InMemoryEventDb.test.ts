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

    expect(db.getEvents(EventA.type)).toEqualUnsorted([events[0], events[1]])
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

    db.removeEvents([events[0]])

    expect(db.find(EventA, { a: 'one' })).toEqual(undefined)
  })

  it('can remove expired events', () => {
    const db = new InMemoryEventDb()
    const events = [
      EventA.mock({ a: 'one' }, 8),
      EventA.mock({ a: 'two' }, 9),
      EventA.mock({ a: 'three' }, 11),
      EventA.mock({ a: 'four' }, 12),
    ]
    events.forEach((e) => db.addEvent(e))

    db.removeExpired(10)

    expect(db.getEvents(EventA.type)).toEqualUnsorted([events[2], events[3]])
  })

  it('maintains the event cap', () => {
    const db = new InMemoryEventDb(4)
    const events = [
      EventA.mock({ a: 'four' }, 4),
      EventA.mock({ a: 'three' }, 3),
      EventA.mock({ a: 'two' }, 2),
      EventA.mock({ a: 'one' }, 1),
      EventA.mock({ a: 'five' }, 5),
      EventA.mock({ a: 'six' }, 6),
    ]
    events.forEach((e) => db.addEvent(e))

    expect(db.getEvents(EventA.type)).toEqualUnsorted([
      events[0],
      events[1],
      events[4],
      events[5],
    ])
  })

  it('maintains the event cap across multiple types', () => {
    const db = new InMemoryEventDb(4)
    const events = [
      EventA.mock({ a: 'four' }, 4),
      EventB.mock({ b1: 'three', b2: 3 }, 3),
      EventA.mock({ a: 'two' }, 2),
      EventB.mock({ b1: 'one', b2: 1 }, 1),
      EventA.mock({ a: 'five' }, 5),
      EventB.mock({ b1: 'six', b2: 6 }, 6),
    ]
    events.forEach((e) => db.addEvent(e))

    expect(db.getEvents(EventA.type)).toEqualUnsorted([events[0], events[4]])
    expect(db.getEvents(EventB.type)).toEqualUnsorted([events[1], events[5]])
  })
})
