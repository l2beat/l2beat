import range from 'lodash/range'

import { ContentEntry } from '../../content/getContent'

export interface GovernanceEventEntry {
  title: string
  link: string
  location: string
  date: string
  status: 'upcoming' | 'past'
}

type OneTimeEvent = ContentEntry<'events'> & {
  data: Extract<ContentEntry<'events'>['data'], { type: 'one-time' }>
}

export function getGovernanceEventEntries(
  events: ContentEntry<'events'>[],
): GovernanceEventEntry[] {
  const oneTimeEvents = getOneTimeEvents(events)
  return oneTimeEvents
    .sort((a, b) => a.data.startDate.getTime() - b.data.startDate.getTime())
    .map(getGovernanceEventEntry)
}

function getGovernanceEventEntry(event: OneTimeEvent): GovernanceEventEntry {
  return {
    title: event.data.title,
    link: event.data.link,
    location: event.data.location,
    date: getDate(event),
    status: event.data.startDate.getTime() > Date.now() ? 'upcoming' : 'past',
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

    const futureEvents: OneTimeEvent[] = range(depth).map((i) => {
      const nextDate = getNextDateForDayOfWeek(
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

    const pastEvents: OneTimeEvent[] = []
    let nextDate = getNextDateForDayOfWeek(data.dayOfWeek, data.startDate)
    while (nextDate.getTime() < Date.now()) {
      const startDate = new Date(nextDate)
      startDate.setHours(data.startHour, data.startMinute)
      const endDate = new Date(nextDate)
      endDate.setHours(data.endHour, data.endMinute)
      pastEvents.push({
        ...event,
        data: {
          type: 'one-time',
          title: data.title,
          startDate,
          endDate,
          location: data.location,
          link: data.link,
        },
      })
      nextDate = getNextDateForDayOfWeek(
        data.dayOfWeek,
        new Date(nextDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      )
    }
    return [...pastEvents, ...futureEvents]
  })
}
function getNextDateForDayOfWeek(
  dayOfWeek: number,
  currentDate = new Date(),
): Date {
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
