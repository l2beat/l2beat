import type { CollectionEntry } from '~/content/getCollection'
import { getNiceEventDate } from '~/utils/events/getNiceEventDate'
import type { OneTimeEvent } from '~/utils/events/getOneTimeEvents'
import { getOneTimeEvents } from '~/utils/events/getOneTimeEvents'

export interface GovernanceEventEntry {
  title: string
  subtitle: string | undefined
  link: string
  location: string | undefined
  startDate: Date
  displayDate: string
  highlighted: boolean | undefined
}

export function getGovernanceEventEntries(
  events: CollectionEntry<'events'>[],
): GovernanceEventEntry[] {
  const oneTimeEvents = getOneTimeEvents(events).sort(
    (a, b) => a.data.startDate.getTime() - b.data.startDate.getTime(),
  )

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
    displayDate: event.data.toBeAnnounced
      ? 'To be announced'
      : getNiceEventDate(event),
  }
}
