import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import {
  CollectionEntry,
  getCollection,
} from '../../../../content/getCollection'
import { Wrapped } from '../../../Page'
import { GovernancePageProps } from '../view/GovernancePage'
import { getGovernanceDelegatedProjectEntry } from './getGovernanceDelegatedProjectEntry'
import { getGovernanceEventEntries } from './getGovernanceEventEntries'
import { getGovernancePublicationEntry } from './getGovernancePublicationEntry'
import { getPageMetadata } from './getPageMetadata'

const INDEX_PAGE_PUBLICATIONS_COUNT = 4
const INDEX_PAGE_EVENTS_COUNT = 8
const INDEX_PAGE_MAX_HIGHLIGHTED_EVENTS = 4

export function getProps(config: Config): Wrapped<GovernancePageProps> {
  const publications = getCollection('publications')
  const events = getCollection('events')
  const delegatedProjects = getCollection('delegatedProjects')

  return {
    props: {
      publications: getPublications(publications),
      events: getEvents(events),
      delegatedProjects: delegatedProjects.map(
        getGovernanceDelegatedProjectEntry,
      ),
      navbar: getNavbarProps(config, 'governance'),
      footer: getFooterProps(config),
    },
    wrapper: {
      metadata: getPageMetadata(),
      banner: false,
    },
  }
}

function getPublications(publications: CollectionEntry<'publications'>[]) {
  return publications
    .sort((a, b) => {
      return b.data.publishedOn.getTime() - a.data.publishedOn.getTime()
    })
    .slice(0, INDEX_PAGE_PUBLICATIONS_COUNT)
    .map(getGovernancePublicationEntry)
}

function getEvents(events: CollectionEntry<'events'>[]) {
  const futureEvents = getGovernanceEventEntries(events)
    .filter((event) => event.startDate.getTime() > Date.now())
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

  const highlightedFutureEvents = futureEvents
    .filter((event) => event.highlighted)
    .slice(0, INDEX_PAGE_MAX_HIGHLIGHTED_EVENTS)

  const notHighlightedFutureEvents = futureEvents
    .filter((event) => !event.highlighted)
    .slice(0, INDEX_PAGE_EVENTS_COUNT - highlightedFutureEvents.length)

  return [...notHighlightedFutureEvents, ...highlightedFutureEvents].sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime(),
  )
}
