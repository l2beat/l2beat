import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getDaSummaryEntries } from '~/server/features/data-availability/summary/getDaSummaryEntries'
import { getDaThroughputSummary } from '~/server/features/data-availability/throughput/getDaThroughputSummary'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getDataAvailabilitySummaryData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const [
    appLayoutProps,
    { publicSystems, customSystems },
    throughputSummaryData,
  ] = await Promise.all([
    getAppLayoutProps(),
    getDaSummaryEntries(),
    getDaThroughputSummary(),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Data Availability Summary - L2BEAT',
        description:
          'Get an overview of the data availability solutions powering Ethereum scaling projects.',
        openGraph: {
          url,
          image: '/meta-images/data-availability/summary/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'DataAvailabilitySummaryPage',
      props: {
        ...appLayoutProps,
        publicSystems,
        customSystems,
        throughputSummaryData,
      },
    },
  }
}
