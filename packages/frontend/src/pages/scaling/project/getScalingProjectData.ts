import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getScalingProjectEntry } from '~/server/features/scaling/project/getScalingProjectEntry'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getProjectMetadataDescription } from '~/ssr/head/getProjectMetadataDescription'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingProjectData(
  req: Request<{ slug: string }, unknown, unknown, unknown>,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData | undefined> {
  const helpers = getSsrHelpers()
  const slug = req.params.slug
  if (!slug) return undefined

  const [appLayoutProps, projectEntry] = await Promise.all([
    getAppLayoutProps(req),
    cache.get(
      {
        key: ['scaling', 'projects', slug],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getCachedProjectEntry(slug, helpers),
    ),
  ])

  if (!projectEntry) return undefined

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${projectEntry.name} - L2BEAT`,
        description: getProjectMetadataDescription({
          name: projectEntry.name,
          display: {
            description: projectEntry.header.description ?? '',
          },
        }),
        openGraph: {
          url: req.originalUrl,
          image: `/meta-images/scaling/projects/${projectEntry.slug}/opengraph-image.png`,
        },
      }),
    },
    ssr: {
      page: 'ScalingProjectPage',
      props: {
        ...appLayoutProps,
        projectEntry,
        queryState: helpers.dehydrate(),
      },
    },
  }
}

async function getCachedProjectEntry(
  slug: string,
  helpers: ReturnType<typeof getSsrHelpers>,
) {
  const project = await ps.getProject({
    slug,
    select: [
      'display',
      'statuses',
      'scalingInfo',
      'scalingRisks',
      'scalingStage',
      'scalingTechnology',
      'tvsInfo',
    ],
    optional: [
      'contracts',
      'permissions',
      'chainConfig',
      'scalingDa',
      'livenessInfo',
      'livenessConfig',
      'customDa',
      'isUpcoming',
      'archivedAt',
      'milestones',
      'trackedTxsConfig',
      'tvsConfig',
      'colors',
      'ecosystemColors',
      'discoveryInfo',
      'daTrackingConfig',
      'costsInfo',
      'activityConfig',
    ],
  })
  if (!project) return undefined
  return getScalingProjectEntry(project, helpers)
}
