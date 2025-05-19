import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/types'
import { getScalingRiskEntries } from '~/server/features/scaling/risks/get-scaling-risk-entries'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingRiskData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getScalingRiskEntries(),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        openGraph: {
          url,
          image: '/meta-images/scaling/risk-analysis/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'ScalingRiskPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
