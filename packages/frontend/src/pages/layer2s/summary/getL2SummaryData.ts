import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import {
  type L2Tab,
  parseL2Tab,
  toLazyTabbedL2Entries,
} from '~/pages/layer2s/utils/lazyL2Tabs'
import {
  getCachedL2SummaryEntries,
  type L2SummaryEntry,
} from '~/server/features/layer2s/summary/getL2SummaryEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { optionToRange } from '~/utils/range/range'
import {
  SCALING_SUMMARY_ACTIVITY_CHART_RANGE_ARGS,
  SCALING_SUMMARY_TVS_CHART_RANGE_ARGS,
} from './l2SummaryConstants'

export async function getL2SummaryData(
  req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const tab = parseL2Tab(req.query.tab)
  const [appLayoutProps, entries, queryState] = await Promise.all([
    getAppLayoutProps(),
    getCachedL2SummaryEntries(),
    cache.get(
      {
        key: ['layer2s', 'summary', 'query-state', tab],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getQueryState(tab),
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        url: req.originalUrl,
        openGraph: {
          image: '/meta-images/layer2s/summary/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'L2SummaryPage',
      props: {
        ...appLayoutProps,
        entries: toLazyTabbedL2Entries(entries, tab, getRowCount),
        queryState,
      },
    },
  }
}

/** The DA column lists each layer in its own row. */
function getRowCount(entry: L2SummaryEntry) {
  return Math.max(1, entry.dataAvailability?.length ?? 1)
}

async function getQueryState(tab: L2Tab) {
  const helpers = getSsrHelpers()

  const tvsChartRange = optionToRange(...SCALING_SUMMARY_TVS_CHART_RANGE_ARGS)
  const activityChartRange = optionToRange(
    ...SCALING_SUMMARY_ACTIVITY_CHART_RANGE_ARGS,
  )
  await Promise.all([
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
    // The TVS breakdown of the tab the page opens on, so its table renders
    // complete. Other tabs fetch theirs when opened.
    helpers.queryClient.prefetchQuery(
      helpers.trpc.tvs.table.queryOptions({
        type: tab,
        excludeAssociatedTokens: false,
        excludeRwaRestrictedTokens: true,
      }),
    ),
  ])

  return helpers.dehydrate()
}
