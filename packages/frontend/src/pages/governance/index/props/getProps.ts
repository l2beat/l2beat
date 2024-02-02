import { Config } from '../../../../build/config'
import { getFooterProps, getNavbarProps } from '../../../../components'
import { ContentEntry, getContent } from '../../../../content/getContent'
import { Wrapped } from '../../../Page'
import { getGovernanceDelegatedProjectEntry } from '../../getGovernanceDelegatedProjectEntry'
import { getGovernanceEventEntries } from '../../getGovernanceEventEntries'
import { getGovernancePublicationEntry } from '../../getGovernancePublicationEntry'
import { GovernancePageProps } from '../view/GovernancePage'
import { getPageMetadata } from './getPageMetadata'

const INDEX_PAGE_EVENTS_COUNT = 8
const INDEX_PAGE_PUBLICATIONS_COUNT = 8
const INDEX_PAGE_MAX_HIGHLIGHTED_EVENTS = 4

export function getProps(config: Config): Wrapped<GovernancePageProps> {
  const publications = getContent('publications')
  const events = getContent('events')
  const delegatedProjects = getContent('delegatedProjects')

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

function getPublications(publications: ContentEntry<'publications'>[]) {
  return publications
    .sort((a, b) => {
      return b.data.publishedOn.getTime() - a.data.publishedOn.getTime()
    })
    .slice(0, INDEX_PAGE_PUBLICATIONS_COUNT)
    .map(getGovernancePublicationEntry)
}

function getEvents(events: ContentEntry<'events'>[]) {
  const futureEvents = getGovernanceEventEntries(events).filter(
    (event) => event.startDate.getTime() > Date.now(),
  )

  const notHighlightedFutureEvents = futureEvents.filter(
    (event) => !event.highlighted,
  )
  const highlightedFutureEvents = futureEvents
    .filter((event) => event.highlighted)
    .slice(0, INDEX_PAGE_MAX_HIGHLIGHTED_EVENTS)

  return [
    ...notHighlightedFutureEvents.slice(
      0,
      INDEX_PAGE_EVENTS_COUNT - highlightedFutureEvents.length,
    ),
    ...highlightedFutureEvents,
  ]
}
