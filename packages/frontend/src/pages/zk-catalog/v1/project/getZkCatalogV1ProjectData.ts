import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getVerifiers } from '~/server/features/zk-catalog/getVerifiers'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getZkCatalogProjectDetails } from './utils/getZkCatalogProjectDetails'

export async function getZkCatalogV1ProjectData(
  req: Request<{ slug: string }, unknown, unknown, unknown>,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData | undefined> {
  const slug = req.params.slug
  if (!slug) return undefined

  const [appLayoutProps, projectDetails] = await Promise.all([
    getAppLayoutProps(req),
    cache.get(
      {
        key: ['zk-catalog', 'v1', 'projects', slug],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getCachedProjectDetails(slug),
    ),
  ])

  if (!projectDetails) return undefined

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${projectDetails.title} - ZK Catalog`,
        openGraph: {
          url: req.originalUrl,
          image: `/meta-images/zk-catalog/projects/${slug}/opengraph-image.png`,
        },
      }),
    },
    ssr: {
      page: 'ZkCatalogV1ProjectPage',
      props: {
        ...appLayoutProps,
        projectDetails,
      },
    },
  }
}

async function getCachedProjectDetails(slug: string) {
  const project = await ps.getProject({
    slug,
    select: ['proofVerification'],
    optional: ['isScaling'],
    whereNot: ['archivedAt'],
  })
  if (!project) return undefined
  const verifiers = await getVerifiers()
  return getZkCatalogProjectDetails(project, verifiers)
}
