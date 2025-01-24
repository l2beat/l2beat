import { expect } from 'earl'
import { EventHandler, EventHandlerDefinition } from './EventHandler'

describe(EventHandler.name, () => {
  describe('validation', () => {
    const action = () => ({ event: '' })

    it('failure cases', () => {
      const failures = [
        { type: 'event', remove: action() },
        { type: 'event', set: action(), add: action() },
        { type: 'event', set: action(), remove: action() },
        { type: 'event', set: action(), add: action(), remove: action() },
      ]

      for (const failure of failures) {
        expect(EventHandlerDefinition.safeParse(failure).success).toBeFalsy()
      }
    })

    it('success with add remove', () => {
      const v = {
        type: 'event',
        add: action(),
        remove: action(),
      }

      expect(EventHandlerDefinition.safeParse(v).success).toBeTruthy()
    })

    it('success with only add', () => {
      const v = { type: 'event', add: action() }

      expect(EventHandlerDefinition.safeParse(v).success).toBeTruthy()
    })

    it('success with only set', () => {
      const v = { type: 'event', set: action() }

      expect(EventHandlerDefinition.safeParse(v).success).toBeTruthy()
    })

    it("failure if you don't set anything", () => {
      const v = { type: 'event' }

      expect(EventHandlerDefinition.safeParse(v).success).toBeFalsy()
    })
  })
})
