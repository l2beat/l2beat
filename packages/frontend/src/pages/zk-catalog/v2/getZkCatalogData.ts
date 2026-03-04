import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getZkCatalogEntries } from '../../../server/features/zk-catalog/getZkCatalogEntries'

export async function getZkCatalogData(
  req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(req),
    cache.get(
      {
        key: ['zk-catalog', 'v2'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      getZkCatalogEntries,
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'ZK Catalog - L2BEAT',
        description:
          "Browse L2BEAT's comprehensive catalog of zero-knowledge projects with in-depth research.",
        openGraph: {
          url: req.originalUrl,
          image: '/meta-images/zk-catalog/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'ZkCatalogPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
