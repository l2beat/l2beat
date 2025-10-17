import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getBridgesProjectEntry } from '~/server/features/bridges/project/getBridgesProjectEntry'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getProjectMetadataDescription } from '~/ssr/head/getProjectMetadataDescription'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getBridgesProjectData(
  manifest: Manifest,
  slug: string,
  url: string,
): Promise<RenderData | undefined> {
  const project = await ps.getProject({
    slug,
    select: [
      'display',
      'statuses',
      'tvsInfo',
      'bridgeInfo',
      'bridgeRisks',
      'bridgeTechnology',
      'display',
    ],
    where: ['isBridge'],
    optional: [
      'tvsConfig',
      'chainConfig',
      'archivedAt',
      'isUpcoming',
      'milestones',
      'contracts',
      'permissions',
      'discoveryInfo',
      'colors',
    ],
  })

  if (!project) return undefined

  const [appLayoutProps, projectEntry] = await Promise.all([
    getAppLayoutProps(),
    getBridgesProjectEntry(project),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${project.name} - L2BEAT`,
        description: getProjectMetadataDescription(project),
        openGraph: {
          url,
          image: `/meta-images/bridges/projects/${project.slug}/opengraph-image.png`,
        },
      }),
    },
    ssr: {
      page: 'BridgesProjectPage',
      props: {
        ...appLayoutProps,
        projectEntry,
      },
    },
  }
}
