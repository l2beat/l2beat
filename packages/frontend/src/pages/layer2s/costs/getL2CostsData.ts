import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getL2CostsEntries } from '~/server/features/layer2s/costs/getL2CostsEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { optionToRange } from '~/utils/range/range'

export async function getL2CostsData(
  req: Request<unknown, unknown, unknown, { tab: 'rollups' | 'others' }>,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, data] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['layer2s', 'costs', 'data'],
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
        title: 'Costs - L2BEAT',
        description:
          'Compare transaction costs across Ethereum scaling solutions.',
        url: req.originalUrl,
        openGraph: {
          image: '/meta-images/layer2s/costs/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'L2CostsPage',
      props: {
        ...appLayoutProps,
        ...data,
        milestones: HOMEPAGE_MILESTONES,
      },
    },
  }
}

async function getCachedData(cache: InMemoryCache, tab: 'rollups' | 'others') {
  const helpers = getSsrHelpers()
  const [entries, queryState] = await Promise.all([
    getL2CostsEntries(helpers),
    cache.get(
      {
        key: ['layer2s', 'costs', 'data', 'query-state', tab],
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

  await helpers.queryClient.prefetchQuery(
    helpers.trpc.costs.chart.queryOptions({
      range: optionToRange('30d'),
      filter: { type: tab },
    }),
  )
  return helpers.dehydrate()
}
