import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ICache } from '~/server/cache/ICache'
import { getScalingTvsEntries } from '~/server/features/scaling/tvs/get-scaling-tvs-entries'
import { parseCookies } from '~/server/utils/parseCookies'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getExpressHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingTvsData(
  req: Request,
  manifest: Manifest,
  cache: ICache,
): Promise<RenderData> {
  const [appLayoutProps, data] = await Promise.all([
    getAppLayoutProps({
      recategorisationPreview: req.query.recategorisationPreview === 'true',
    }),
    cache.get(
      {
        key: ['scaling', 'tvs', 'data'],
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

async function getCachedData() {
  const helpers = getExpressHelpers()
  const [entries] = await Promise.all([
    getScalingTvsEntries(),
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
    entries,
    queryState: helpers.dehydrate(),
  }
}
