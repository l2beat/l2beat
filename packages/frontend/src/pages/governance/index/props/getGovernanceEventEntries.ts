import { CollectionEntry } from '../../../../content/getCollection'
import { formatTimestamp } from '../../../../utils'
import {
  getOneTimeEvents,
  OneTimeEvent,
} from '../../../../utils/events/getOneTimeEvents'

export interface GovernanceEventEntry {
  title: string
  subtitle: string | undefined
  link: string
  location: string
  startDate: Date
  displayDate: string
  highlighted: boolean | undefined
}

export function getGovernanceEventEntries(
  events: CollectionEntry<'events'>[],
): GovernanceEventEntry[] {
  const oneTimeEvents = getOneTimeEvents(events)

  return oneTimeEvents.map(getGovernanceEventEntry)
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

function getNiceEventDate(event: OneTimeEvent) {
  const startDay = event.data.startDate.getDate()
  const startTimestamp = Math.ceil(event.data.startDate.getTime() / 1000)

  if (!event.data.endDate) {
    return formatTimestamp(startTimestamp, { mode: 'datetime' })
  }

  const endDay = event.data.endDate.getDate()
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
