import { getBridgesProjectEntry } from 'rewrite/src/server/features/bridges/project/get-bridges-project-entry'
import { ps } from 'rewrite/src/server/projects'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/types'
import { getExpressHelpers } from 'rewrite/src/trpc/server'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
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
    ],
  })

  if (!project) return undefined

  const helpers = getExpressHelpers()
  const [appLayoutProps, projectEntry] = await Promise.all([
    getAppLayoutProps(),
    getBridgesProjectEntry(project),
    helpers.tvs.chart.prefetch({
      range: '1y',
      filter: { type: 'projects', projectIds: [project.id] },
      excludeAssociatedTokens: false,
      previewRecategorisation: false,
    }),
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
