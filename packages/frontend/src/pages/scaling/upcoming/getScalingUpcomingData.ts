import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getScalingUpcomingEntries } from '~/server/features/scaling/upcoming/getScalingUpcomingEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingUpcomingData(
  req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(req),
    cache.get(
      {
        key: ['scaling', 'upcoming', 'entries'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      getScalingUpcomingEntries,
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Upcoming Scaling Projects - L2BEAT',
        description:
          'Discover upcoming Ethereum scaling solutions before they launch.',
        openGraph: {
          url: req.originalUrl,
          image: '/meta-images/scaling/upcoming/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'ScalingUpcomingPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
