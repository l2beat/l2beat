import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/types'
import { getDaThroughputEntries } from '~/server/features/data-availability/throughput/get-da-throughput-entries'
import { getExpressHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getDataAvailabilityThroughputData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const helpers = getExpressHelpers()
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getDaThroughputEntries(),
    helpers.da.chart.prefetch({ range: '30d', includeScalingOnly: false }),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        openGraph: {
          url,
          image:
            '/meta-images/data-availability/throughput/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'DataAvailabilityThroughputPage',
      props: {
        ...appLayoutProps,
        entries,
        dehydratedState: helpers.dehydrate(),
      },
    },
  }
}
