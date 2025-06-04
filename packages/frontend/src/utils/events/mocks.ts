import type { OneTimeEvent, RecurringEvent } from './getOneTimeEvents'

export const oneTimeEventMock = (event?: {
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

export const recurringEventMock = (event?: {
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
