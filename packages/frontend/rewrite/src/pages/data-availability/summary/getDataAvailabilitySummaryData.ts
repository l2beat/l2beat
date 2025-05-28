import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import { getDaSummaryEntries } from 'rewrite/src/server/features/data-availability/summary/get-da-summary-entries'
import { getDaThroughputSummary } from 'rewrite/src/server/features/data-availability/throughput/get-da-throughput-summary'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/types'
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
