import { dehydrate } from '@tanstack/react-query'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getDaThroughputEntries } from '~/server/features/data-availability/throughput/getDaThroughputEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { optionToRange } from '~/utils/range/range'

export async function getDataAvailabilityThroughputData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const helpers = getSsrHelpers()
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getDaThroughputEntries(),
    helpers.queryClient.prefetchQuery(
      helpers.trpc.da.chart.queryOptions({
        range: optionToRange('1y'),
        includeScalingOnly: true,
      }),
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Data Availability Throughput - L2BEAT',
        description:
          'Explore metrics related to the data posted to data availability solutions.',
        url,
        openGraph: {
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
        queryState: dehydrate(helpers.queryClient),
      },
    },
  }
}
