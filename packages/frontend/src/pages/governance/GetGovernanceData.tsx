import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getCollection } from '~/content/getCollection'
import { getGovernanceEventEntries } from '~/pages/governance/utils/getGovernanceEventEntries'
import { getGovernancePublicationEntry } from '~/pages/publications/governance/utils/getGovernancePublicationEntry'
import { getProjectIcon } from '~/server/features/utils/getProjectIcon'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getGovernanceData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()
  const publications = getCollection('governance-publications')
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
