import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getScalingSummaryEntries } from '~/server/features/scaling/summary/getScalingSummaryEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { optionToRange } from '~/utils/range/range'
import {
  SCALING_SUMMARY_ACTIVITY_CHART_RANGE_ARGS,
  SCALING_SUMMARY_TVS_CHART_RANGE_ARGS,
} from './scalingSummaryConstants'

export async function getScalingSummaryData(
  req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, data] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['scaling', 'summary', 'data'],
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
        url: req.originalUrl,
        openGraph: {
          image: '/meta-images/scaling/summary/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'ScalingSummaryPage',
      props: {
        ...appLayoutProps,
        ...data,
      },
    },
  }
}

async function getCachedData() {
  const helpers = getSsrHelpers()

  const tvsChartRange = optionToRange(...SCALING_SUMMARY_TVS_CHART_RANGE_ARGS)
  const activityChartRange = optionToRange(
    ...SCALING_SUMMARY_ACTIVITY_CHART_RANGE_ARGS,
  )
  const [entries] = await Promise.all([
    getScalingSummaryEntries(),
    helpers.queryClient.prefetchQuery(
      helpers.trpc.tvs.recategorisedChart.queryOptions({
        range: tvsChartRange,
        excludeAssociatedTokens: false,
        excludeRwaRestrictedTokens: true,
        filter: { type: 'layer2' },
      }),
    ),
    helpers.queryClient.prefetchQuery(
      helpers.trpc.activity.recategorisedChart.queryOptions({
        range: activityChartRange,
        filter: { type: 'all' },
      }),
    ),
    helpers.queryClient.prefetchQuery(
      helpers.trpc.tvs.table.queryOptions({
        type: 'rollups',
        excludeAssociatedTokens: false,
        excludeRwaRestrictedTokens: true,
      }),
    ),
  ])

  return {
    entries,
    queryState: helpers.dehydrate(),
  }
}
