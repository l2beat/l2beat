import range from 'lodash/range'

import { ContentEntry } from '../../content/getContent'

export interface GovernanceEventEntry {
  title: string
  link: string
  location: string
  date: string
}

type OneTimeEvent = ContentEntry<'events'> & {
  data: Extract<ContentEntry<'events'>['data'], { type: 'one-time' }>
}

export function getGovernanceEventEntries(
  events: ContentEntry<'events'>[],
): GovernanceEventEntry[] {
  const oneTimeEvents = getOneTimeEvents(events)

  return oneTimeEvents
    .filter((event) => event.data.startDate.getTime() > Date.now())
    .sort((a, b) => a.data.startDate.getTime() - b.data.startDate.getTime())
    .map(getGovernanceEventEntry)
}

function getGovernanceEventEntry(event: OneTimeEvent): GovernanceEventEntry {
  return {
    title: event.data.title,
    link: event.data.link,
    location: event.data.location,
    date: getDate(event),
  }
}

function getOneTimeEvents(
  events: ContentEntry<'events'>[],
  depth = 5,
): OneTimeEvent[] {
  return events.flatMap((event) => {
    if (event.data.type === 'one-time') {
      return {
        ...event,
        data: event.data,
      }
    }

    const data = event.data
    return range(depth).map((i) => {
      const nextDate = getNextDateForDay(
        data.dayOfWeek,
        new Date(Date.now() + i * 7 * 24 * 60 * 60 * 1000),
      )

      const startDate = new Date(nextDate)
      startDate.setHours(data.startHour, data.startMinute)
      const endDate = new Date(nextDate)
      endDate.setHours(data.endHour, data.endMinute)

      return {
        ...event,
        data: {
          type: 'one-time',
          title: data.title,
          startDate,
          endDate,
          location: data.location,
          link: data.link,
        },
      }
    })
  })
}
function getNextDateForDay(dayOfWeek: number, currentDate = new Date()): Date {
  if (dayOfWeek < 0 || dayOfWeek > 6) {
    throw new Error('Day must be between 0 (Sunday) and 6 (Saturday)')
  }

  const currentDayOfWeek = currentDate.getDay()
  let daysToAdd = dayOfWeek - currentDayOfWeek

  if (daysToAdd <= 0) {
    daysToAdd += 7
  }

  currentDate.setDate(currentDate.getDate() + daysToAdd)
  return currentDate
}

function getDate(event: OneTimeEvent) {
  const startDay = event.data.startDate.getDate()
  const endDay = event.data.endDate.getDate()

  if (startDay === endDay) {
    return `${event.data.startDate.toLocaleDateString()}\n${event.data.startDate.toLocaleTimeString(
      undefined,
      { hour: 'numeric', minute: 'numeric' },
    )} - ${event.data.endDate.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: 'numeric',
    })}`
  }

  if (
    event.data.startDate.getUTCHours() === 0 &&
    event.data.endDate.getUTCHours() === 0
  ) {
    return `${event.data.startDate.toLocaleDateString()} - ${event.data.startDate.toLocaleDateString()}`
  }

  return `${event.data.startDate.toLocaleDateString()} ${event.data.startDate.toLocaleTimeString(
    undefined,
    {
      hour: 'numeric',
      minute: 'numeric',
    },
  )} -\n${event.data.endDate.toLocaleDateString()} ${event.data.endDate.toLocaleTimeString(
    undefined,
    {
      hour: 'numeric',
      minute: 'numeric',
    },
  )}`
}
