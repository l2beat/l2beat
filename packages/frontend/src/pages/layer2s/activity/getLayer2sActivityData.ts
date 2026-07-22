import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getLayer2sActivityEntries } from '~/server/features/layer2s/activity/getLayer2sActivityEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { optionToRange } from '~/utils/range/range'

export async function getLayer2sActivityData(
  req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, data] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['layer2s', 'activity', 'data'],
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
        url: req.originalUrl,
        openGraph: {
          image: '/meta-images/layer2s/activity/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'Layer2sActivityPage',
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

  const entries = await getLayer2sActivityEntries()

  await Promise.all([
    helpers.queryClient.prefetchQuery(
      helpers.trpc.activity.recategorisedChart.queryOptions({
        range: optionToRange('1y'),
        filter: {
          type: 'projects',
          projectIds: entries.map((entry) => entry.id),
        },
      }),
    ),
    helpers.queryClient.prefetchQuery(
      helpers.trpc.activity.chartStats.queryOptions({
        filter: {
          type: 'projects',
          projectIds: entries.map((entry) => entry.id),
        },
      }),
    ),
  ])

  return {
    entries,
    queryState: helpers.dehydrate(),
  }
}
