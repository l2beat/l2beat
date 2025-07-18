import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ICache } from '~/server/cache/ICache'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getZkCatalogEntries } from '../../../server/features/zk-catalog/getZkCatalogEntries'

export async function getZkCatalogData(
  manifest: Manifest,
  url: string,
  cache: ICache,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
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
        description: 'A catalog of the ZK projects with detailed research.',
        openGraph: {
          url,
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
