import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/types'
import { getScalingTvsEntries } from '~/server/features/scaling/tvs/get-scaling-tvs-entries'
import { getExpressHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingTvsData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const helpers = getExpressHelpers()
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
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
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        openGraph: {
          url,
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
        dehydratedState: helpers.dehydrate(),
      },
    },
  }
}
