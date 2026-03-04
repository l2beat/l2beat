import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getDaRiskEntries } from '~/server/features/data-availability/risks/getDaRiskEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
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
        title: 'Data Availability Risk Analysis - L2BEAT',
        description:
          'Learn more about the risks of data availability solutions.',
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
