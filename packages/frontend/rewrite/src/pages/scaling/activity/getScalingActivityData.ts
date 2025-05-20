import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/types'
import { getScalingActivityEntries } from '~/server/features/scaling/activity/get-scaling-activity-entries'
import { getExpressHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingActivityData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const helpers = getExpressHelpers()
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getScalingActivityEntries(),
    helpers.activity.chart.prefetch({
      range: '1y',
      filter: { type: 'rollups' },
      previewRecategorisation: false,
    }),
    helpers.activity.chartStats.prefetch({
      filter: { type: 'rollups' },
      previewRecategorisation: false,
    }),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        openGraph: {
          url,
          image: '/meta-images/scaling/activity/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'ScalingActivityPage',
      props: {
        ...appLayoutProps,
        entries,
        milestones: HOMEPAGE_MILESTONES,
        dehydratedState: helpers.dehydrate(),
      },
    },
  }
}
