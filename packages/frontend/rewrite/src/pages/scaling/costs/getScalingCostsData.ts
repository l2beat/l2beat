import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import type { Request } from 'express'
import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { ICache } from 'rewrite/src/server/cache/ICache'
import { parseCookies } from 'rewrite/src/server/utils/parseCookies'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/types'
import { getScalingCostsEntries } from '~/server/features/scaling/costs/get-scaling-costs-entries'
import { getExpressHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingCostsData(
  req: Request,
  manifest: Manifest,
  cache: ICache,
): Promise<RenderData> {
  const cookies = parseCookies(req)
  const [appLayoutProps, data] = await Promise.all([
    getAppLayoutProps({
      recategorisationPreview: cookies.recategorisationPreview,
    }),
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
  const helpers = getExpressHelpers()
  const [entries] = await Promise.all([
    getScalingCostsEntries(),
    helpers.costs.chart.prefetch({
      range: '30d',
      filter: { type: 'rollups' },
      previewRecategorisation: false,
    }),
    helpers.costs.table.prefetch({ range: '30d' }),
  ])

  return {
    entries,
    queryState: helpers.dehydrate(),
  }
}
