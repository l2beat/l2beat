import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/server'
import { getDaRiskEntries } from '~/server/features/data-availability/risks/get-da-risk-entries'
import type { Manifest } from '~/utils/Manifest'

export async function getDataAvailabilityRiskData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getDaRiskEntries(),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        openGraph: {
          url,
          image:
            '/meta-images/data-availability/risk-analysis/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'DataAvailabilityRiskPage',
      props: {
        ...appLayoutProps,
        ...entries,
      },
    },
  }
}
