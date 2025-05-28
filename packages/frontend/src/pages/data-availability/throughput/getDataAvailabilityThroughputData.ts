import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getDaThroughputEntries } from '~/server/features/data-availability/throughput/get-da-throughput-entries'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/types'
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
    helpers.da.chart.prefetch({ range: '1y', includeScalingOnly: false }),
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
        queryState: helpers.dehydrate(),
      },
    },
  }
}
