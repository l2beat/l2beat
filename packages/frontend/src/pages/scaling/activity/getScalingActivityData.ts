import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ICache } from '~/server/cache/ICache'
import { getScalingActivityEntries } from '~/server/features/scaling/activity/getScalingActivityEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getExpressHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingActivityData(
  req: Request,
  manifest: Manifest,
  cache: ICache,
): Promise<RenderData> {
  const [appLayoutProps, data] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['./Scaling', 'activity', 'data'],
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

async function getCachedData() {
  const helpers = getExpressHelpers()

  const [entries] = await Promise.all([
    getScalingActivityEntries(),
    helpers.activity.chart.prefetch({
      range: '1y',
      filter: { type: 'rollups' },
      previewRecategorisation: false,
    }),
    helpers.activity.chartStats.prefetch({
      filter: { type: 'rollups' },
      previewRecategorisation: false,
    }),
  ])

  return {
    entries,
    queryState: helpers.dehydrate(),
  }
}
