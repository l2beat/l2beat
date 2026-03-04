import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getDaLivenessEntries } from '~/server/features/data-availability/liveness/getDaLivenessEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getDataAvailabilityLivenessData(
  req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(req),
    cache.get(
      {
        key: ['data-availability', 'liveness'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      getDaLivenessEntries,
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Data Availability Liveness - L2BEAT',
        description:
          'Monitor liveness metrics of data availability solutions and recent anomalies.',
        openGraph: {
          url: req.originalUrl,
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
