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

  it('can find a new event after the first query', () => {
    // This is a test to prevent a bug that occured before.
    // A dynamic index (called Lookup) was constructed during
    // the first query. But that index was not updated with
    // new events later.
    const db = new InMemoryEventDb()

    const eventA1 = EventA.mock({ a: 'one' })
    db.addEvent(eventA1)
    // Here the index (Lookup) is constructed for EventA
    expect(db.find(EventA, { a: 'one' })).toEqual(eventA1)

    const eventA2 = EventA.mock({ a: 'two' })
    // This call should update the index of EventA
    db.addEvent(eventA2)
    // so that it can be found later:
    expect(db.find(EventA, { a: 'two' })).toEqual(eventA2)
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

  it('can remove expired events when only one event exists', () => {
    const db = new InMemoryEventDb()
    const event = EventA.mock({ a: 'expired' }, 5)
    db.addEvent(event)

    db.removeExpired(10)

    expect(db.getEvents(EventA.type)).toEqual([])
    expect(db.getEventCount()).toEqual(0)
  })

  it('can remove events for a specific plugin', () => {
    const db = new InMemoryEventDb()
    const events = [
      { ...EventA.mock({ a: 'one' }), plugin: 'plugin-a' },
      { ...EventA.mock({ a: 'two' }), plugin: 'plugin-b' },
      { ...EventB.mock({ b1: 'b1', b2: 1 }), plugin: 'plugin-a' },
      { ...EventB.mock({ b1: 'b2', b2: 2 }), plugin: 'plugin-b' },
    ]
    events.forEach((e) => db.addEvent(e))

    db.removeForPlugin('plugin-a')

    expect(db.getEvents(EventA.type)).toEqual([events[1]])
    expect(db.getEvents(EventB.type)).toEqual([events[3]])
    expect(db.getEventCount()).toEqual(2)
  })

  it('can remove multiple expired events leaving one', () => {
    const db = new InMemoryEventDb()
    const events = [
      EventA.mock({ a: 'one' }, 5),
      EventA.mock({ a: 'two' }, 6),
      EventA.mock({ a: 'three' }, 7),
      EventA.mock({ a: 'four' }, 15),
    ]
    events.forEach((e) => db.addEvent(e))

    db.removeExpired(10)

    expect(db.getEvents(EventA.type)).toEqual([events[3]])
    expect(db.getEventCount()).toEqual(1)
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
