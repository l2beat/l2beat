import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getVerifiers } from '~/server/features/zk-catalog/getVerifiers'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '../../../utils/Manifest'
import { getZkCatalogV1Entries } from './utils/getZkCatalogV1Entries'

export async function getZkCatalogV1Data(
  req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(req),
    cache.get(
      {
        key: ['zk-catalog', 'v1'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      async () => {
        const [verifiers, projects] = await Promise.all([
          getVerifiers(),
          ps.getProjects({
            select: ['proofVerification'],
            whereNot: ['archivedAt'],
          }),
        ])
        return getZkCatalogV1Entries(projects, verifiers)
      },
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'ZK Catalog - L2BEAT',
        description: 'A catalog of the ZK projects with detailed research.',
        openGraph: {
          url: req.originalUrl,
          image: '/meta-images/zk-catalog/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'ZkCatalogPageV1',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
