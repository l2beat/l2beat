import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getBridgesProjectEntry } from '~/server/features/bridges/project/getBridgesProjectEntry'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
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

  const helpers = getSsrHelpers()
  const [appLayoutProps, projectEntry] = await Promise.all([
    getAppLayoutProps(),
    getBridgesProjectEntry(helpers, project),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${project.name} - L2BEAT`,
        description: project.display.description,
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
        queryState: helpers.dehydrate(),
      },
    },
  }
}
