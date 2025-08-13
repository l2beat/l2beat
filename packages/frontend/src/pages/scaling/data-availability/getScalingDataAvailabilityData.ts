import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ICache } from '~/server/cache/ICache'
import { getScalingDaEntries } from '~/server/features/scaling/data-availability/getScalingDaEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingDataAvailabilityData(
  req: Request,
  manifest: Manifest,
  cache: ICache,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['scaling', 'data-availability', 'entries'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      getScalingDaEntries,
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Data Availability - L2BEAT',
        description:
          'Compare data availability solutions used by Ethereum scaling projects.',
        openGraph: {
          url: req.originalUrl,
          image: '/meta-images/scaling/data-availability/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'ScalingDataAvailabilityPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
