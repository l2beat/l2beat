import { notUndefined } from '@l2beat/shared-pure'
import clamp from 'lodash/clamp'
import range from 'lodash/range'

import { ContentEntry } from '../../content/getContent'
import { getNextDateForDayOfWeek } from '../dates'

export type OneTimeEvent = ContentEntry<'events'> & {
  data: Extract<ContentEntry<'events'>['data'], { type: 'one-time' }>
}
export type RecurringEvent = ContentEntry<'events'> & {
  data: Extract<ContentEntry<'events'>['data'], { type: 'recurring' }>
}

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000

export function getOneTimeEvents(
  events: ContentEntry<'events'>[],
): OneTimeEvent[] {
  return events.flatMap((event) => {
    if (event.data.type === 'one-time') {
      return {
        ...event,
        data: event.data,
      }
    }
    const nextEventDate = getNextDateForDayOfWeek(
      event.data.dayOfWeek,
      new Date(Date.now()),
    )

    const data = event.data
    const weeksSinceStart = Math.floor(
      (nextEventDate.getTime() - data.sinceDate.getTime()) / WEEK_IN_MS,
    )

    const weeksTillEnd = data.tillDate
      ? clamp(
          getWeeksTillEnd(data.tillDate, nextEventDate),
          event.data.futureEventsCount,
        )
      : event.data.futureEventsCount
    console.log(weeksSinceStart, weeksTillEnd)
    console.log(range(-weeksSinceStart, weeksTillEnd))
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
    new Date(Date.now() + weeksOffset * WEEK_IN_MS),
  )

  const isCancelled = event.data.cancelledAt?.some((date) => {
    return date.getTime() === nextDate.getTime()
  })
  if (isCancelled) return

  const startDate = new Date(nextDate)
  startDate.setHours(event.data.startDate.hour, event.data.startDate.minute)

  let endDate: Date | undefined
  if (event.data.endDate) {
    endDate = new Date(startDate)
    endDate.setHours(event.data.endDate.hour, event.data.endDate.minute)
  }

  return {
    ...event,
    data: {
      type: 'one-time' as const,
      title: event.data.title,
      subtitle: event.data.subtitle,
      startDate,
      endDate,
      highlighted: undefined,
      location: event.data.location,
      link: event.data.link,
    },
  }
}

function getWeeksTillEnd(tillDate: Date, nextEventDate: Date) {
  const weeksOffset =
    (tillDate.getTime() - nextEventDate.getTime()) / WEEK_IN_MS
  const fn = weeksOffset > 0 ? Math.ceil : Math.floor
  return fn(weeksOffset)
}
