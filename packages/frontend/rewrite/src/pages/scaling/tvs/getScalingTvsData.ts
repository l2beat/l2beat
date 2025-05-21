import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import type { Request } from 'express'
import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { ICache } from 'rewrite/src/server/cache/ICache'
import { parseCookies } from 'rewrite/src/server/utils/parseCookies'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/types'
import { getScalingTvsEntries } from '~/server/features/scaling/tvs/get-scaling-tvs-entries'
import { getExpressHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingTvsData(
  req: Request,
  manifest: Manifest,
  cache: ICache,
): Promise<RenderData> {
  const helpers = getExpressHelpers()
  const cookies = parseCookies(req)
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps({
      recategorisationPreview: cookies.recategorisationPreview,
    }),
    cache.get(
      { key: ['scaling', 'tvs', 'entries'], ttl: 10 * 60 },
      getScalingTvsEntries,
    ),
    helpers.tvs.chart.prefetch({
      filter: {
        type: 'rollups',
      },
      range: '1y',
      excludeAssociatedTokens: false,
      previewRecategorisation: false,
    }),
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
        entries,
        milestones: HOMEPAGE_MILESTONES,
        queryState: helpers.dehydrate(),
      },
    },
  }
}
