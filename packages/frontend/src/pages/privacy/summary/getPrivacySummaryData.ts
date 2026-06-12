import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getPrivacySummaryEntries } from '~/server/features/privacy/getPrivacySummaryEntries'
import { ps } from '~/server/projects'
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
        bestPracticesBannerImageUrl: manifest.getUrl(
          '/images/best-practices-banner.png',
        ),
        queryState,
      },
    },
  }
}

async function getCachedData() {
  const helpers = getSsrHelpers()

  const defaultChartRange = optionToRange('1y')
  const projects = (
    await ps.getProjects({
      where: ['privacyInfo'],
      select: ['display', 'privacyInfo', 'statuses', 'tvsConfig'],
      optional: ['contracts', 'permissions', 'discoveryInfo'],
    })
  ).sort((a, b) => a.slug.localeCompare(b.slug))

  const projectIds = projects.map((e) => e.id).sort()
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getPrivacySummaryEntries(projects),
    helpers.queryClient.prefetchQuery(
      helpers.trpc.privacy.flowsChart.queryOptions({
        projectIds,
        range: defaultChartRange,
      }),
    ),
    helpers.queryClient.prefetchQuery(
      helpers.trpc.privacy.tvlChart.queryOptions({
        projectIds,
        range: defaultChartRange,
      }),
    ),
  ])
  return {
    appLayoutProps,
    entries,
    queryState: helpers.dehydrate(),
    defaultChartRange,
  }
}
