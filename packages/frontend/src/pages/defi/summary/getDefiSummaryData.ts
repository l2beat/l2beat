import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getDefiSummaryEntries } from '~/server/features/defi/getDefiSummaryEntries'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getDefiSummaryData(
  manifest: Manifest,
  url: string,
  cache: InMemoryCache,
): Promise<RenderData> {
  const { appLayoutProps, entries } = await cache.get(
    {
      key: ['defi', 'summary', 'data'],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    getCachedData,
  )

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'DeFi - L2BEAT',
        description: 'Overview of DeFi protocols tracked by L2BEAT.',
        url,
        openGraph: {
          image: '/meta-images/defi/summary/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'DefiSummaryPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}

async function getCachedData() {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    ps
      .getProjects({
        where: ['defiInfo'],
        select: ['display', 'defiInfo', 'statuses'],
        optional: ['externalDependencies', 'tvsConfig'],
      })
      .then(getDefiSummaryEntries),
  ])

  return { appLayoutProps, entries }
}
