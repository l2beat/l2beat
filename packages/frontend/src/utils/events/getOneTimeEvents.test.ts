import { expect } from 'earl'
import { reset, set } from 'mockdate'

import {
  getOneTimeEvents,
  OneTimeEvent,
  RecurringEvent,
} from './getOneTimeEvents'

describe(getOneTimeEvents.name, () => {
  beforeEach(() => {
    set('2021-01-01T13:00:00Z')
  })

  afterEach(() => {
    reset()
  })

  it('returns an empty array if there are no events', () => {
    expect(getOneTimeEvents([])).toEqual([])
  })

  it('should throw an error if since date is after till date', () => {
    const event: RecurringEvent = recurringEvent({
      data: {
        sinceDate: new Date('2021-06-01'),
        tillDate: new Date('2021-05-16'),
      },
    })

    expect(() => getOneTimeEvents([event])).toThrow(
      'Since date is after till date',
    )
  })

  it('returns one-time event for one-time event input', () => {
    const event = oneTimeEvent()
    expect(getOneTimeEvents([event])).toEqual([event])
  })

  describe('returns one-time events for recurring event input', () => {
    describe('since date in past', () => {
      it('end date in past', () => {
        const event: RecurringEvent = recurringEvent({
          data: {
            sinceDate: new Date('2020-12-07'),
            tillDate: new Date('2020-12-28'),
            futureEventsCount: 1,
          },
        })
        const events = getOneTimeEvents([event])

        expect(events).toEqual([
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2020-12-09T13:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2020-12-16T13:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2020-12-23T13:00:00.000Z') },
          }),
        ])
      })

      it('end date in future', () => {
        const event: RecurringEvent = recurringEvent({
          data: {
            sinceDate: new Date('2020-12-09'),
            tillDate: new Date('2021-01-27'),
            futureEventsCount: 1000,
          },
        })
        const events = getOneTimeEvents([event])

        expect(events).toEqual([
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2020-12-09T13:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2020-12-16T13:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2020-12-23T13:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2020-12-30T13:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-01-06T13:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-01-13T13:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-01-20T13:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-01-27T13:00:00.000Z') },
          }),
        ])
      })

      it('end date in future and clamps endWeekOffset to futureEventsCount', () => {
        const event: RecurringEvent = recurringEvent({
          data: {
            sinceDate: new Date('2020-12-07'),
            tillDate: new Date('2021-01-31'),
            futureEventsCount: 2,
          },
        })
        const events = getOneTimeEvents([event])

        expect(events).toEqual([
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2020-12-09T13:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2020-12-16T13:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2020-12-23T13:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2020-12-30T13:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-01-06T13:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-01-13T13:00:00.000Z') },
          }),
        ])
      })

      it('no end date', () => {
        const event: RecurringEvent = recurringEvent({
          data: {
            sinceDate: new Date('2020-12-07'),
            futureEventsCount: 2,
          },
        })
        const events = getOneTimeEvents([event])

        expect(events).toEqual([
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2020-12-09T13:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2020-12-16T13:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2020-12-23T13:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2020-12-30T13:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-01-06T13:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-01-13T13:00:00.000Z') },
          }),
        ])
      })
    })

    describe('since date in future', () => {
      it('end date in future', () => {
        const event: RecurringEvent = recurringEvent({
          data: {
            sinceDate: new Date('2021-01-08'),
            tillDate: new Date('2021-01-31'),
            futureEventsCount: 1000,
          },
        })
        const events = getOneTimeEvents([event])

        expect(events).toEqual([
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-01-13T13:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-01-20T13:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-01-27T13:00:00.000Z') },
          }),
        ])
      })

      it('end date in future and clamps endWeekOffset to futureEventsCount', () => {
        const event: RecurringEvent = recurringEvent({
          data: {
            sinceDate: new Date('2021-01-08'),
            tillDate: new Date('2021-01-31'),
            futureEventsCount: 2,
          },
        })
        const events = getOneTimeEvents([event])

        expect(events).toEqual([
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-01-13T13:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-01-20T13:00:00.000Z') },
          }),
        ])
      })

      it('no end date', () => {
        const event: RecurringEvent = recurringEvent({
          data: {
            sinceDate: new Date('2021-01-08'),
            tillDate: new Date('2021-01-31'),
            futureEventsCount: 2,
          },
        })
        const events = getOneTimeEvents([event])

        expect(events).toEqual([
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-01-13T13:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-01-20T13:00:00.000Z') },
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
            data: { startDate: new Date('2021-04-28T13:00:00.000Z') },
          }),
          oneTimeEvent({
            id: event.id,
            data: { startDate: new Date('2021-05-12T13:00:00.000Z') },
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
            data: { startDate: new Date('2021-05-05T13:00:00.000Z') },
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
