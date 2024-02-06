import { expect } from 'earl'
import { reset, set } from 'mockdate'

import {
  getOneTimeEvents,
  OneTimeEvent,
  RecurringEvent,
} from './getOneTimeEvents'

describe(getOneTimeEvents.name, () => {
  beforeEach(() => {
    set('2021-04-23T13:00:00Z')
  })

  afterEach(() => {
    reset()
  })

  it('returns an empty array if there are no events', () => {
    expect(getOneTimeEvents([])).toEqual([])
  })

  it('returns one-time event for one-time event input', () => {
    const event = oneTimeEvent()
    expect(getOneTimeEvents([event])).toEqual([event])
  })

  describe('returns one-time events for recurring event input', () => {
    it('with minimum arguments', () => {
      const event: RecurringEvent = recurringEvent()

      const events = getOneTimeEvents([event])

      expect(events).toEqual([
        oneTimeEvent({
          id: event.id,
          data: { startDate: new Date('2021-04-28T11:00:00.000Z') },
        }),
        oneTimeEvent({
          id: event.id,
          data: { startDate: new Date('2021-05-05T11:00:00.000Z') },
        }),
        oneTimeEvent({
          id: event.id,
          data: { startDate: new Date('2021-05-12T11:00:00.000Z') },
        }),
      ])
    })

    describe('futureEventsCount', () => {
      it('generates future events for futureEventsCount', () => {
        const event: RecurringEvent = recurringEvent({
          data: {
            futureEventsCount: 4,
          },
        })

        const events = getOneTimeEvents([event])
        expect(events).toEqual([
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-04-28T11:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-05-05T11:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-05-12T11:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-05-19T11:00:00.000Z') },
          }),
        ])
      })
      it('gets limited by endDate', () => {
        const event: RecurringEvent = recurringEvent({
          data: {
            futureEventsCount: 4,
            tillDate: new Date('2021-05-12'),
          },
        })

        const events = getOneTimeEvents([event])
        expect(events).toEqual([
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-04-28T11:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-05-05T11:00:00.000Z') },
          }),
        ])
      })
    })

    describe('cancelledAt', () => {
      it('cancels an event for given day', () => {
        const event: RecurringEvent = recurringEvent({
          data: { cancelledAt: [new Date('2021-05-05')] },
        })

        const events = getOneTimeEvents([event])
        expect(events).toEqual([
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-04-28T11:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-05-12T11:00:00.000Z') },
          }),
        ])
      })

      it('cancels an event for given days', () => {
        const event: RecurringEvent = recurringEvent({
          data: {
            cancelledAt: [new Date('2021-04-28'), new Date('2021-05-12')],
          },
        })

        const events = getOneTimeEvents([event])
        expect(events).toEqual([
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-05-05T11:00:00.000Z') },
          }),
        ])
      })
    })

    describe('endDate', () => {
      it('does not generate further events', () => {
        const event: RecurringEvent = recurringEvent({
          data: { tillDate: new Date('2021-05-13') },
        })

        const events = getOneTimeEvents([event])
        expect(events).toEqual([
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-04-28T11:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-05-05T11:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-05-12T11:00:00.000Z') },
          }),
        ])
      })

      it('is exclusive', () => {
        const event: RecurringEvent = recurringEvent({
          data: { tillDate: new Date('2021-05-05') },
        })

        const events = getOneTimeEvents([event])
        expect(events).toEqual([
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-04-28T11:00:00.000Z') },
          }),
        ])
      })

      it('stops generating events after endDate', () => {
        const event: RecurringEvent = recurringEvent({
          data: {
            sinceDate: new Date('2021-04-01'),
            tillDate: new Date('2021-04-21'),
          },
        })

        const events = getOneTimeEvents([event])
        expect(events).toEqual([
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-04-07T11:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-04-14T11:00:00.000Z') },
          }),
        ])
      })
    })
  })
})

const oneTimeEvent = (event?: {
  id?: string
  data?: Partial<OneTimeEvent['data']>
}): OneTimeEvent => ({
  id: '1',
  ...event,
  data: {
    type: 'one-time',
    title: 'Event',
    startDate: new Date('2021-04-21T12:00:00Z'),
    link: 'https://example.com',
    location: 'Location',
    endDate: undefined,
    highlighted: undefined,
    subtitle: undefined,
    ...event?.data,
  },
})

const recurringEvent = (event?: {
  id?: string
  data?: Partial<RecurringEvent['data']>
}): RecurringEvent => ({
  id: '2',
  ...event,
  data: {
    type: 'recurring',
    title: 'Event',
    sinceDate: new Date('2021-04-22T12:00:00Z'),
    futureEventsCount: 3,
    dayOfWeek: 3,
    startDate: {
      hour: 13,
      minute: 0,
    },
    link: 'https://example.com',
    location: 'Location',
    ...event?.data,
  },
})
