import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getDaThroughputEntries } from '~/server/features/data-availability/throughput/getDaThroughputEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { optionToRange } from '~/utils/range/range'

export async function getDataAvailabilityThroughputData(
  request: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const helpers = getSsrHelpers()
  const [appLayoutProps, [entries]] = await Promise.all([
    getAppLayoutProps(request),
    cache.get(
      {
        key: ['data-availability', 'throughput'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () =>
        Promise.all([
          getDaThroughputEntries(),
          helpers.da.chart.prefetch({
            range: optionToRange('1y'),
            includeScalingOnly: true,
          }),
        ]),
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Data Availability Throughput - L2BEAT',
        description:
          'Explore metrics related to the data posted to data availability solutions.',
        openGraph: {
          url: request.originalUrl,
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
