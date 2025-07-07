import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ICache } from '~/server/cache/ICache'
import { getScalingTvsEntries } from '~/server/features/scaling/tvs/getScalingTvsEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingTvsData(
  req: Request<
    unknown,
    unknown,
    unknown,
    { tab: 'rollups' | 'validiumsAndOptimiums' | 'others' | 'notReviewed' }
  >,
  manifest: Manifest,
  cache: ICache,
): Promise<RenderData> {
  const [appLayoutProps, data] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['scaling', 'tvs', 'data'],
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
          image: '/meta-images/scaling/value-secured/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'ScalingTvsPage',
      props: {
        ...appLayoutProps,
        ...data,
        milestones: HOMEPAGE_MILESTONES,
      },
    },
  }
}

async function getCachedData(
  cache: ICache,
  tab: 'rollups' | 'validiumsAndOptimiums' | 'others' | 'notReviewed',
) {
  const [entries, queryState] = await Promise.all([
    getScalingTvsEntries(),
    cache.get(
      {
        key: ['scaling', 'tvs', 'data', 'query-state', tab],
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

async function getQueryState(
  tab: 'rollups' | 'validiumsAndOptimiums' | 'others' | 'notReviewed',
) {
  const helpers = getSsrHelpers()

  // Skip prefetching for underReview tab as it doesn't have chart data
  if (tab === 'notReviewed') {
    return helpers.dehydrate()
  }

  await helpers.tvs.chart.prefetch({
    filter: {
      type: tab,
    },
    range: { type: '1y' },
    excludeAssociatedTokens: false,
  })
  return helpers.dehydrate()
}
