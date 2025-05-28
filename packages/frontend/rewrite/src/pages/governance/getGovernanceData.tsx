import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import { getProjectIcon } from 'rewrite/src/server/features/utils/get-project-icon'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/types'
import { getGovernanceEventEntries } from '~/app/(side-nav)/governance/_utils/get-governance-event-entries'
import { getGovernancePublicationEntry } from '~/app/(side-nav)/governance/_utils/get-governance-publication-entry'
import { getCollection } from '~/content/get-collection'
import type { Manifest } from '~/utils/Manifest'

export async function getGovernanceData(
  manifest: Manifest,
  url: string,
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
      metadata: getMetadata(manifest, {
        title: 'Governance - L2BEAT',
        description:
          'Discover everything about the L2BEAT Governance Team, including the latest insights, analyses, and updates',
        openGraph: {
          url,
          image: '/meta-images/governance/opengraph-image.png',
        },
      }),
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
