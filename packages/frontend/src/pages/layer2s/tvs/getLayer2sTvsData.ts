import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getLayer2sTvsEntries } from '~/server/features/layer2s/tvs/getLayer2sTvsEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { optionToRange } from '~/utils/range/range'

export async function getLayer2sTvsData(
  req: Request<
    unknown,
    unknown,
    unknown,
    { tab: 'rollups' | 'validiumsAndOptimiums' | 'others' }
  >,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, data] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['layer2s', 'tvs', 'data'],
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
        title: 'Total Value Secured - L2BEAT',
        description:
          'Track total value secured across Ethereum scaling solutions.',
        url: req.originalUrl,
        openGraph: {
          image: '/meta-images/layer2s/value-secured/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'Layer2sTvsPage',
      props: {
        ...appLayoutProps,
        ...data,
        milestones: HOMEPAGE_MILESTONES,
      },
    },
  }
}

async function getCachedData(
  cache: InMemoryCache,
  tab: 'rollups' | 'validiumsAndOptimiums' | 'others',
) {
  const entries = await getLayer2sTvsEntries()

  const queryState = await cache.get(
    {
      key: ['layer2s', 'tvs', 'data', 'query-state', tab],
      ttl: 5 * 60,
      staleWhileRevalidate: 25 * 60,
    },
    () => getQueryState(tab, entries),
  )

  return {
    entries,
    queryState,
  }
}

async function getQueryState(
  tab: 'rollups' | 'validiumsAndOptimiums' | 'others',
  entries: Awaited<ReturnType<typeof getLayer2sTvsEntries>>,
) {
  const helpers = getSsrHelpers()

  await Promise.all([
    helpers.queryClient.prefetchQuery(
      helpers.trpc.tvs.detailedChart.queryOptions({
        filter: {
          type: 'projects',
          projectIds: entries[tab].map((entry) => entry.id),
        },
        range: optionToRange('1y'),
        excludeAssociatedTokens: false,
        excludeRwaRestrictedTokens: true,
      }),
    ),
    helpers.queryClient.prefetchQuery(
      helpers.trpc.tvs.table.queryOptions({
        type: tab,
        excludeAssociatedTokens: false,
        excludeRwaRestrictedTokens: true,
      }),
    ),
    helpers.queryClient.prefetchQuery(
      helpers.trpc.tvs.chartStats.queryOptions({
        filter: {
          type: 'projects',
          projectIds: [
            ...entries.rollups,
            ...entries.validiumsAndOptimiums,
            ...entries.others,
          ].map((entry) => entry.id),
        },
        excludeAssociatedTokens: false,
        excludeRwaRestrictedTokens: true,
      }),
    ),
  ])
  return helpers.dehydrate()
}
