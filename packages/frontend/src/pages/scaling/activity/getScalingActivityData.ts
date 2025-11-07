import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ICache } from '~/server/cache/ICache'
import { getScalingActivityEntries } from '~/server/features/scaling/activity/getScalingActivityEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
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
        key: ['scaling', 'activity', 'data'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getCachedData(),
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Activity - L2BEAT',
        description:
          'Track activity across Ethereum scaling projects with interactive charts.',
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
  const helpers = getSsrHelpers()

  const [entries] = await Promise.all([
    getScalingActivityEntries(),
    helpers.activity.chart.prefetch({
      range: { type: '1y' },
      filter: { type: 'rollups' },
    }),
    helpers.activity.chartStats.prefetch({
      filter: { type: 'rollups' },
    }),
  ])

  return {
    entries,
    queryState: helpers.dehydrate(),
  }
}
