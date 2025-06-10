import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ICache } from '~/server/cache/ICache'
import { getScalingActivityEntries } from '~/server/features/scaling/activity/getScalingActivityEntries'
import type { ScalingTab } from '~/server/features/scaling/getCommonScalingEntry'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingActivityData(
  req: Request<unknown, unknown, unknown, { tab: ScalingTab }>,
  manifest: Manifest,
  cache: ICache,
): Promise<RenderData> {
  const [appLayoutProps, data] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['scaling', 'activity', 'data', req.query.tab],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getCachedData(cache, req.query.tab),
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        openGraph: {
          url: req.originalUrl,
          image: '/meta-images/scaling/activity/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'ScalingActivityPage',
      props: {
        ...appLayoutProps,
        ...data,
        milestones: HOMEPAGE_MILESTONES,
      },
    },
  }
}

async function getCachedData(cache: ICache, tab: ScalingTab) {
  const [entries, queryState] = await Promise.all([
    getScalingActivityEntries(),
    cache.get(
      {
        key: ['scaling', 'activity', 'query-state', tab],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getQueryState(tab),
    ),
  ])

  return {
    entries,
    queryState,
  }
}

async function getQueryState(tab: ScalingTab) {
  const helpers = getSsrHelpers()

  if (tab === 'underReview') {
    return helpers.dehydrate()
  }

  await Promise.all([
    helpers.activity.chart.prefetch({
      range: '1y',
      filter: { type: tab },
      previewRecategorisation: false,
    }),
    helpers.activity.chartStats.prefetch({
      filter: { type: tab },
      previewRecategorisation: false,
    }),
  ])
  return helpers.dehydrate()
}
