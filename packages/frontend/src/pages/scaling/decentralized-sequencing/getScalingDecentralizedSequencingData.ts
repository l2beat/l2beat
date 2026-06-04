import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getScalingDecentralizedSequencingEntries } from '~/server/features/scaling/decentralized-sequencing/getScalingDecentralizedSequencingEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingDecentralizedSequencingData(
  req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['scaling', 'decentralized-sequencing', 'entries'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      getScalingDecentralizedSequencingEntries,
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Decentralized Sequencing - L2BEAT',
        description:
          'Compare Ethereum scaling projects with decentralized sequencer sets and understand how they differ from centralized sequencers with forced-inclusion mechanisms.',
        url: req.originalUrl,
        openGraph: {
          image:
            '/meta-images/scaling/decentralized-sequencing/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'ScalingDecentralizedSequencingPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
