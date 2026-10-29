import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { optionToRange } from '~/utils/range/range'
import { getZkCatalogEntries } from '../../../server/features/zk-catalog/getZkCatalogEntries'

export async function getZkCatalogData(
  manifest: Manifest,
  url: string,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, { entries, defaultChartRange, queryState }] =
    await Promise.all([
      getAppLayoutProps(),
      cache.get(
        {
          key: ['zk-catalog', 'v2'],
          ttl: 5 * 60,
          staleWhileRevalidate: 25 * 60,
        },
        getCachedData,
      ),
    ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: 'ZK Catalog',
        description:
          "Browse L2BEAT's comprehensive catalog of zero-knowledge projects with in-depth research.",
        url,
        openGraph: {
          image: '/meta-images/zk-catalog/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'ZkCatalogPage',
      props: {
        ...appLayoutProps,
        entries,
        defaultChartRange,
        queryState,
      },
    },
  }
}

async function getCachedData() {
  const helpers = getSsrHelpers()
  const defaultChartRange = optionToRange('1y')
  const [entries] = await Promise.all([
    getZkCatalogEntries(),
    helpers.queryClient.prefetchQuery(
      helpers.trpc.tvs.zkCatalogChart.queryOptions({
        range: defaultChartRange,
      }),
    ),
  ])
  return { entries, defaultChartRange, queryState: helpers.dehydrate() }
}
