import { notUndefined } from '@l2beat/shared-pure'
import clamp from 'lodash/clamp'
import range from 'lodash/range'

import type { CollectionEntry } from '~/content/getCollection'
import { getNextDateForDayOfWeek } from '../dates'

export type OneTimeEvent = CollectionEntry<'events'> & {
  data: Extract<CollectionEntry<'events'>['data'], { type: 'one-time' }>
}
export type RecurringEvent = CollectionEntry<'events'> & {
  data: Extract<CollectionEntry<'events'>['data'], { type: 'recurring' }>
}

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000

export function getOneTimeEvents(
  events: CollectionEntry<'events'>[],
): OneTimeEvent[] {
  return events.flatMap((event) => {
    if (event.data.type === 'one-time') {
      return {
        ...event,
        data: event.data,
      }
    }
    const thisWeekEventDate = getNextDateForDayOfWeek(
      event.data.dayOfWeek,
      new Date(),
    )

    const data = event.data

    if (data.tillDate && data.sinceDate.getTime() > data.tillDate.getTime()) {
      throw new Error('Since date is after till date')
    }

    const startWeekOffset = getStartWeekOffset(
      data.sinceDate,
      thisWeekEventDate,
    )
    const endWeekOffset = getEndWeekOffset(
      startWeekOffset,
      data.tillDate,
      thisWeekEventDate,
      data.futureEventsCount,
    )

    return range(startWeekOffset, endWeekOffset + 1)
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
  startDate.setUTCHours(event.data.startDate.hour, event.data.startDate.minute)

  let endDate: Date | undefined
  if (event.data.endDate) {
    endDate = new Date(startDate)
    endDate.setUTCHours(event.data.endDate.hour, event.data.endDate.minute)
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

function getStartWeekOffset(sinceDate: Date, thisWeekEventDate: Date) {
  return Math.ceil(
    (sinceDate.getTime() - thisWeekEventDate.getTime()) / WEEK_IN_MS,
  )
}

function getEndWeekOffset(
  startWeekOffset: number,
  tillDate: Date | undefined,
  thisWeekEventDate: Date,
  futureEventsCount: number,
) {
  futureEventsCount = futureEventsCount - 1
  const weeksOffset = tillDate
    ? Math.floor(
        (tillDate.getTime() - thisWeekEventDate.getTime()) / WEEK_IN_MS,
      )
    : undefined

  if (startWeekOffset > 0) {
    const clampedWeeksOffset = weeksOffset
      ? clamp(weeksOffset - startWeekOffset, futureEventsCount)
      : futureEventsCount
    return startWeekOffset + clampedWeeksOffset
  }

  const clampedWeeksOffset = weeksOffset
    ? clamp(weeksOffset, futureEventsCount)
    : futureEventsCount
  return clampedWeeksOffset
}
