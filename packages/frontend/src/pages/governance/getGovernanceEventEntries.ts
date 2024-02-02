import { notUndefined } from '@l2beat/shared-pure'
import clamp from 'lodash/clamp'
import range from 'lodash/range'

import { ContentEntry } from '../../content/getContent'
import { formatTimestamp } from '../../utils'

export interface GovernanceEventEntry {
  title: string
  subtitle: string | undefined
  link: string
  location: string
  startDate: Date
  displayDate: string
  highlighted: boolean | undefined
}

type OneTimeEvent = ContentEntry<'events'> & {
  data: Extract<ContentEntry<'events'>['data'], { type: 'one-time' }>
}
type RecurringEvent = ContentEntry<'events'> & {
  data: Extract<ContentEntry<'events'>['data'], { type: 'recurring' }>
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
    subtitle: event.data.subtitle,
    link: event.data.link,
    location: event.data.location,
    highlighted: event.data.highlighted,
    startDate: event.data.startDate,
    displayDate: getNiceEventDate(event),
  }
}

function getOneTimeEvents(events: ContentEntry<'events'>[]): OneTimeEvent[] {
  return events.flatMap((event) => {
    if (event.data.type === 'one-time') {
      return {
        ...event,
        data: event.data,
      }
    }

    const data = event.data
    const weeksSinceStart = Math.floor(
      (Date.now() - data.startDate.getTime()) / (7 * 24 * 60 * 60 * 1000),
    )

    const weeksTillEnd = data.endDate
      ? clamp(
          Math.ceil(
            (data.endDate.getTime() - Date.now()) / (7 * 24 * 60 * 60 * 1000),
          ),
          event.data.futureEventsCount,
        )
      : event.data.futureEventsCount

    return range(-weeksSinceStart, weeksTillEnd)
      .map((weeksOffset) =>
        getEventForWeek(event as RecurringEvent, weeksOffset),
      )
      .filter(notUndefined)
  })
}

function getEventForWeek(
  event: RecurringEvent,
  weeksOffset: number,
): OneTimeEvent | undefined {
  const nextDate = getNextDateForDayOfWeek(
    event.data.dayOfWeek,
    new Date(Date.now() + weeksOffset * 7 * 24 * 60 * 60 * 1000),
  )

  const isCancelled = event.data.cancelledAt?.some((date) => {
    return date.getTime() === nextDate.getTime()
  })
  if (isCancelled) return

  const startDate = new Date(nextDate)
  startDate.setHours(event.data.startHour, event.data.startMinute)
  const endDate = new Date(nextDate)
  endDate.setHours(event.data.endHour, event.data.endMinute)

  return {
    ...event,
    data: {
      type: 'one-time' as const,
      title: event.data.title,
      subtitle: event.data.subtitle,
      startDate,
      endDate,
      highlighted: event.data.highlighted,
      location: event.data.location,
      link: event.data.link,
    },
  }
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

  currentDate.setUTCDate(currentDate.getDate() + daysToAdd)
  currentDate.setUTCHours(0, 0, 0, 0)

  return currentDate
}

function getNiceEventDate(event: OneTimeEvent) {
  const startDay = event.data.startDate.getDate()
  const endDay = event.data.endDate.getDate()
  const startTimestamp = Math.ceil(event.data.startDate.getTime() / 1000)
  const endTimestamp = Math.ceil(event.data.endDate.getTime() / 1000)

  if (startDay === endDay) {
    return `${formatTimestamp(startTimestamp, {
      mode: 'date',
    })}\n${formatTimestamp(startTimestamp, { mode: 'time' }).slice(
      0,
      -6,
    )} - ${formatTimestamp(endTimestamp, { mode: 'time' })}`
  }

  return `${formatTimestamp(startTimestamp)} - ${formatTimestamp(endTimestamp)}`
}
