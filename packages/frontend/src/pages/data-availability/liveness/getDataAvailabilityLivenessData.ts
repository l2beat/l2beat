import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getDaLivenessEntries } from '~/server/features/data-availability/liveness/getDaLivenessEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getDataAvailabilityLivenessData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getDaLivenessEntries(),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Data Availability Liveness - L2BEAT',
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
      page: 'DataAvailabilityLivenessPage',
      props: {
        ...appLayoutProps,
        ...entries,
      },
    },
  }
}
