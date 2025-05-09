import { HOMEPAGE_MILESTONES } from '@l2beat/config'
import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getScalingCostsEntries } from '~/server/features/scaling/costs/get-scaling-costs-entries'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingCostsData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getScalingCostsEntries(),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        openGraph: {
          url,
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
      },
    },
  }
}
