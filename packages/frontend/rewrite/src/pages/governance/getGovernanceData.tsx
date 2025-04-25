import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getGovernanceEventEntries } from '~/app/(side-nav)/governance/_utils/get-governance-event-entries'
import { getGovernancePublicationEntry } from '~/app/(side-nav)/governance/_utils/get-governance-publication-entry'
import { getCollection } from '~/content/get-collection'
import { getProjectIcon } from '~/server/features/utils/get-project-icon'
import type { Manifest } from '~/utils/Manifest'

export async function getGovernanceData(
  manifest: Manifest,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()
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

  return {
    head: {
      manifest,
      title: 'Glossary - L2BEAT',
      description: "A glossary of terms for Ethereum's Layer 2 ecosystem",
    },
    ssr: {
      page: 'GovernancePage',
      props: {
        ...appLayoutProps,
        publications: publicationEntries,
        events: eventEntries,
        delegatedProjects,
      },
    },
  }
}
