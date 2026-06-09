import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getScalingRiskDaEntries } from '~/server/features/scaling/risks/data-availability/getScalingRiskDaEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingRiskDataAvailabilityData(
  req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['scaling', 'risk', 'data-availability', 'entries'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      getScalingRiskDaEntries,
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
          image: '/meta-images/scaling/data-availability/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'ScalingRiskDataAvailabilityPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
