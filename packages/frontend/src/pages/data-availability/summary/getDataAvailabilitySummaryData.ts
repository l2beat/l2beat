import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getDaSummaryEntries } from '~/server/features/data-availability/summary/getDaSummaryEntries'
import { getDaThroughputSummary } from '~/server/features/data-availability/throughput/getDaThroughputSummary'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getDataAvailabilitySummaryData(
  req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [
    appLayoutProps,
    [{ publicSystems, customSystems }, throughputSummaryData],
  ] = await Promise.all([
    getAppLayoutProps(req),
    cache.get(
      {
        key: ['data-availability', 'summary'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => Promise.all([getDaSummaryEntries(), getDaThroughputSummary()]),
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Data Availability Summary - L2BEAT',
        description:
          'Get an overview of the data availability solutions powering Ethereum scaling projects.',
        openGraph: {
          url: req.originalUrl,
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
