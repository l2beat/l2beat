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
          'Monitor liveness metrics of data availability solutions and recent anomalies.',
        openGraph: {
          url,
          image: '/meta-images/data-availability/liveness/opengraph-image.png',
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
