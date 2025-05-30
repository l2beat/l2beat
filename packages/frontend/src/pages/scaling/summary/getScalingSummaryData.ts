import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ICache } from '~/server/cache/ICache'
import { getScalingSummaryEntries } from '~/server/features/scaling/summary/get-scaling-summary-entries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getExpressHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { SCALING_SUMMARY_TIME_RANGE } from './ScalingSummaryPage'

export async function getScalingSummaryData(
  req: Request,
  manifest: Manifest,
  cache: ICache,
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
        openGraph: {
          url: req.originalUrl,
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
  const helpers = getExpressHelpers()

  const [entries] = await Promise.all([
    getScalingSummaryEntries(),
    helpers.tvs.recategorisedChart.prefetch({
      range: SCALING_SUMMARY_TIME_RANGE,
      filter: { type: 'layer2' },
      previewRecategorisation: false,
    }),
    helpers.activity.recategorisedChart.prefetch({
      range: SCALING_SUMMARY_TIME_RANGE,
      filter: { type: 'all' },
      previewRecategorisation: false,
    }),
    helpers.activity.chartStats.prefetch({
      filter: { type: 'all' },
      previewRecategorisation: false,
    }),
  ])

  return {
    entries,
    queryState: helpers.dehydrate(),
  }
}
