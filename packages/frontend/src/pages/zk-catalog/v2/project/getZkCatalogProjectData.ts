import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getZkCatalogProjectEntry } from '~/server/features/zk-catalog/project/getZkCatalogProjectEntry'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getZkCatalogProjectData(
  req: Request,
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
        key: ['zk-catalog', 'v2', 'projects', slug],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getCachedProjectEntry(slug),
    ),
  ])

  if (!projectEntry) return undefined

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${projectEntry.name} - L2BEAT`,
        description: projectEntry.header.description,
        openGraph: {
          url: req.originalUrl,
          image: `/meta-images/zk-catalog/projects/${projectEntry.slug}/opengraph-image.png`,
        },
      }),
    },
    ssr: {
      page: 'ZkCatalogProjectPage',
      props: {
        ...appLayoutProps,
        projectEntry,
        queryState: helpers.dehydrate(),
      },
    },
  }
}

async function getCachedProjectEntry(slug: string) {
  const project = await ps.getProject({
    slug,
    select: ['zkCatalogInfo', 'display', 'statuses'],
    optional: ['archivedAt', 'milestones', 'tvsInfo'],
  })
  if (!project) return undefined
  return getZkCatalogProjectEntry(project)
}
