import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getL2RiskDaEntries } from '~/server/features/layer2s/risks/data-availability/getL2RiskDaEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getL2RiskDataAvailabilityData(
  req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['layer2s', 'risk', 'data-availability', 'entries'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      getL2RiskDaEntries,
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Data Availability - L2BEAT',
        description:
          'Compare data availability solutions used by Ethereum scaling projects.',
        url: req.originalUrl,
        openGraph: {
          image:
            '/meta-images/layer2s/risks/data-availability/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'L2RiskDataAvailabilityPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
