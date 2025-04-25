import type { Metadata } from 'next'
import { getCollection } from '~/content/get-collection'
import { getProjectIcon } from '~/server/features/utils/get-project-icon'
import { getDefaultMetadata } from '~/utils/metadata'
import { GovernancePage } from './_page'
import { getGovernanceEventEntries } from './_utils/get-governance-event-entries'
import { getGovernancePublicationEntry } from './_utils/get-governance-publication-entry'

export const metadata: Metadata = getDefaultMetadata({
  title: 'Governance - L2BEAT',
  description:
    'Discover everything about the L2BEAT Governance Team, including the latest insights, analyses, and updates',
  openGraph: {
    url: '/governance',
  },
})

export default function Page() {
  const publications = getCollection('publications')
    .sort((a, b) => b.data.publishedOn.getTime() - a.data.publishedOn.getTime())
    .slice(0, 4)
  const publicationEntries = publications.map(getGovernancePublicationEntry)

  const events = getCollection('events')
  const allEventEntries = getGovernanceEventEntries(events)
  const nearestEventIndex = allEventEntries.findIndex(
    (e) => e.startDate > new Date(),
  )
  const eventEntries = allEventEntries.slice(
    nearestEventIndex,
    nearestEventIndex + 8,
  )
  const delegatedProjects = getCollection('delegated-projects').map(
    (project) => ({
      ...project,
      icon: getProjectIcon(project.data.slug),
    }),
  )

  return (
    <GovernancePage
      publications={publicationEntries}
      events={eventEntries}
      delegatedProjects={delegatedProjects}
    />
  )
}
