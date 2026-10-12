import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getPrivacyProjects } from '~/server/features/privacy/getPrivacyProjects'
import { getPrivacySummaryEntries } from '~/server/features/privacy/getPrivacySummaryEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { optionToRange } from '~/utils/range/range'
import { getPrivacySummaryGroups } from './privacySummaryGroups'

export async function getPrivacySummaryData(
  manifest: Manifest,
  url: string,
  cache: InMemoryCache,
): Promise<RenderData> {
  const {
    appLayoutProps,
    groups,
    chartProjects,
    queryState,
    defaultChartRange,
  } = await cache.get(
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
        name: 'Privacy',
        description:
          'Live balances, flows and privacy assessments of privacy protocols on Ethereum.',
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
        groups,
        chartProjects,
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
  const projects = (await getPrivacyProjects()).sort((a, b) =>
    a.slug.localeCompare(b.slug),
  )

  const flowProjectIds = projects
    .filter(
      (project) =>
        project.tvsConfig !== undefined ||
        project.privacyInfo.tokens.some((token) => token.buckets.length > 0),
    )
    .map((e) => e.id)
    .sort()
  const tvlProjectIds = projects
    .filter((project) => project.tvsConfig !== undefined)
    .map((e) => e.id)
    .sort()
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getPrivacySummaryEntries(projects),
    helpers.queryClient.prefetchQuery(
      helpers.trpc.privacy.flowsChart.queryOptions({
        projectIds: flowProjectIds,
        range: defaultChartRange,
      }),
    ),
    helpers.queryClient.prefetchQuery(
      helpers.trpc.tvs.chartByProjects.queryOptions({
        projectIds: tvlProjectIds,
        range: defaultChartRange,
      }),
    ),
  ])
  return {
    appLayoutProps,
    groups: getPrivacySummaryGroups(entries),
    chartProjects: entries
      .filter((e) => e.isTracked || e.hasTvl)
      .map((e) => ({ id: e.id, name: e.name, hasTvl: e.hasTvl })),
    queryState: helpers.dehydrate(),
    defaultChartRange,
  }
}
