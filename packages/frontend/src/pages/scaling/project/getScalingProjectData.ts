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
import { getSelectedUpdateId } from '../../utils/getSelectedUpdateId'

export async function getScalingProjectData(
  req: Request<{ slug: string }, unknown, unknown, unknown>,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData | undefined> {
  const data = await cache.get(
    {
      key: ['scaling', 'projects', req.params.slug],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () => getCachedData(manifest, req.params.slug, req.originalUrl),
  )
  if (!data) return undefined

  return {
    ...data,
    ssr: {
      ...data.ssr,
      props: {
        ...data.ssr.props,
        selectedUpdateId: getSelectedUpdateId(req.query),
      },
    },
  }
}

async function getCachedData(manifest: Manifest, slug: string, url: string) {
  const helpers = getSsrHelpers()
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

  const [appLayoutProps, projectEntry] = await Promise.all([
    getAppLayoutProps(),
    getScalingProjectEntry(project, helpers),
  ])
  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${project.name} - L2BEAT`,
        description: getProjectMetadataDescription(project),
        url,
        openGraph: {
          image: `/meta-images/scaling/projects/${project.slug}/opengraph-image.png`,
        },
      }),
    },
    ssr: {
      page: 'ScalingProjectPage' as const,
      props: {
        ...appLayoutProps,
        projectEntry,
        queryState: helpers.dehydrate(),
      },
    },
  }
}
