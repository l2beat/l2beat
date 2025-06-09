import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ICache } from '~/server/cache/ICache'
import { getScalingCostsEntries } from '~/server/features/scaling/costs/getScalingCostsEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingCostsData(
  req: Request,
  manifest: Manifest,
  cache: ICache,
): Promise<RenderData> {
  const [appLayoutProps, data] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['scaling', 'costs', 'data'],
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
          image: '/meta-images/scaling/costs/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'ScalingCostsPage',
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
    getScalingCostsEntries(helpers),
    helpers.costs.chart.prefetch({
      range: '30d',
      filter: { type: 'rollups' },
      previewRecategorisation: false,
    }),
  ])

  return {
    entries,
    queryState: helpers.dehydrate(),
  }
}
