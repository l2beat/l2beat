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
  req: Request<unknown, unknown, unknown, { tab: 'rollups' | 'others' }>,
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
      () => getCachedData(cache, req.query.tab),
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

async function getCachedData(cache: ICache, tab: 'rollups' | 'others') {
  const helpers = getSsrHelpers()
  const [entries, queryState] = await Promise.all([
    getScalingCostsEntries(helpers),
    cache.get(
      {
        key: ['scaling', 'costs', 'data', 'query-state', tab],
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

async function getQueryState(tab: 'rollups' | 'others') {
  const helpers = getSsrHelpers()

  await helpers.costs.chart.prefetch({
    range: '30d',
    filter: { type: tab },
  })
  return helpers.dehydrate()
}
