import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getPrivacyProjects } from '~/server/features/privacy/getPrivacyProjects'
import { getPrivacySummaryEntries } from '~/server/features/privacy/getPrivacySummaryEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { optionToRange } from '~/utils/range/range'

export async function getPrivacySummaryData(
  manifest: Manifest,
  url: string,
  cache: InMemoryCache,
): Promise<RenderData> {
  const { appLayoutProps, entries, queryState, defaultChartRange } =
    await cache.get(
      {
        key: ['privacy', 'summary', 'data'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      getCachedData,
    )

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Privacy - L2BEAT',
        description:
          'Track live balances and daily privacy flows across tracked privacy protocols.',
        url,
        openGraph: {
          image: '/meta-images/privacy/summary/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'PrivacySummaryPage',
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
  const projects = await getPrivacyProjects()

  const projectIds = projects.map((e) => e.id)
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getPrivacySummaryEntries(projects),
    helpers.privacy.flowsChart.prefetch({
      projectIds,
      range: defaultChartRange,
    }),
    helpers.privacy.tvsChart.prefetch({
      projectIds,
      range: defaultChartRange,
    }),
  ])
  return {
    appLayoutProps,
    entries,
    queryState: helpers.dehydrate(),
    defaultChartRange,
  }
}
