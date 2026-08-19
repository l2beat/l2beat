import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getL2ProjectEntry } from '~/server/features/layer2s/project/getL2ProjectEntry'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getProjectMetadataDescription } from '~/ssr/head/getProjectMetadataDescription'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getL2ProjectData(
  req: Request<{ slug: string }, unknown, unknown, { update?: string }>,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData | undefined> {
  const data = await cache.get(
    {
      key: ['layer2s', 'projects', req.params.slug],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () => getCachedData(manifest, req.params.slug, req.originalUrl),
  )
  if (!data) return undefined

  return {
    head: data.head,
    ssr: {
      page: 'L2ProjectPage',
      props: {
        ...data.props,
        selectedUpdateId: req.query.update,
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
    getL2ProjectEntry(project, helpers),
  ])
  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${project.name} - L2BEAT`,
        description: getProjectMetadataDescription(project),
        url,
        openGraph: {
          image: `/meta-images/layer2s/projects/${project.slug}/opengraph-image.png`,
        },
      }),
    },
    props: {
      ...appLayoutProps,
      projectEntry,
      queryState: helpers.dehydrate(),
    },
  }
}
