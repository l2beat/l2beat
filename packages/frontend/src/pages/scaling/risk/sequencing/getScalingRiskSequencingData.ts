import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getScalingRiskSequencingEntries } from '~/server/features/scaling/risks/sequencing/getScalingRiskSequencingEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingRiskSequencingData(
  req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, props] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['scaling', 'risk', 'sequencing', 'entries'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      getScalingRiskSequencingEntries,
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Sequencing - L2BEAT',
        description:
          'Compare Ethereum scaling projects with decentralized sequencer sets and understand how they differ from centralized sequencers with forced-inclusion mechanisms.',
        url: req.originalUrl,
        openGraph: {
          image: '/meta-images/scaling/sequencing/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'ScalingRiskSequencingPage',
      props: {
        ...appLayoutProps,
        ...props,
      },
    },
  }
}
