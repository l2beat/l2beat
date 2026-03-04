import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getDaRiskEntries } from '~/server/features/data-availability/risks/getDaRiskEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getDataAvailabilityRiskData(
  req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(req),
    cache.get(
      {
        key: ['data-availability', 'risk', 'entries'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      getDaRiskEntries,
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Data Availability Risk Analysis - L2BEAT',
        description:
          'Learn more about the risks of data availability solutions.',
        openGraph: {
          url: req.originalUrl,
          image:
            '/meta-images/data-availability/risk-analysis/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'DataAvailabilityRiskPage',
      props: {
        ...appLayoutProps,
        ...entries,
      },
    },
  }
}
