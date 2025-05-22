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
  const helpers = getExpressHelpers()
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps({
      recategorisationPreview: cookies.recategorisationPreview,
    }),
    cache.get(
      { key: ['scaling', 'costs', 'entries'], ttl: 10 * 60 },
      getScalingCostsEntries,
    ),
    helpers.costs.chart.prefetch({
      range: '30d',
      filter: { type: 'rollups' },
      previewRecategorisation: false,
    }),
    helpers.costs.table.prefetch({ range: '30d' }),
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
        entries,
        milestones: HOMEPAGE_MILESTONES,
        queryState: helpers.dehydrate(),
      },
    },
  }
}
