import { Logger } from '@l2beat/backend-tools'
import type { InteropPluginName } from '@l2beat/config'
import { expect } from 'earl'
import {
  createInteropEventType,
  type InteropEvent,
  type InteropPlugin,
} from '../../plugins/types'
import { InMemoryEventDb } from '../capture/InMemoryEventDb'
import { match } from './InteropMatchingLoop'

describe('match', () => {
  it('does not expose already matched events to later matches', async () => {
    const Event = createInteropEventType<{ id: string }>('test.Event')
    const db = new InMemoryEventDb()

    const eventA = Event.mock({ id: 'a' }, 1)
    const eventB = Event.mock({ id: 'b' }, 2)
    const eventC = Event.mock({ id: 'c' }, 3)
    db.addEvent(eventA)
    db.addEvent(eventB)
    db.addEvent(eventC)

    let sawEventC = false
    let matchedLookup: InteropEvent | undefined

    const plugin: InteropPlugin = {
      name: 'mock-plugin' as InteropPluginName,
      matchTypes: [Event],
      match(event, eventDb) {
        if (!Event.checkType(event)) {
          return
        }
        if (event.args.id === 'a') {
          return [
            {
              kind: 'InteropMessage',
              app: 'test-app',
              type: 'test-type',
              events: [event, eventB],
              src: event,
              dst: eventB,
            },
          ]
        }
        if (event.args.id === 'c') {
          sawEventC = true
          // Matched events should not be visible to later match calls.
          matchedLookup = eventDb.find(Event, { id: 'b' })
          if (matchedLookup) {
            return [{ kind: 'InteropIgnore', events: [event, matchedLookup] }]
          }
        }
      },
    }

    const result = await match(
      db,
      (type) => db.getEvents(type),
      db.getEventTypes(),
      db.getEventCount(),
      [plugin],
      [],
      Logger.SILENT,
    )

    expect(sawEventC).toEqual(true)
    expect(matchedLookup).toEqual(undefined)
    expect(result.messages.length).toEqual(1)
    expect(result.unsupported.length).toEqual(0)
  })
})
