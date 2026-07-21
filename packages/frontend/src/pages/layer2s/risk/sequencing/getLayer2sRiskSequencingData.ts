import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getLayer2sRiskSequencingEntries } from '~/server/features/layer2s/risks/sequencing/getLayer2sRiskSequencingEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getLayer2sRiskSequencingData(
  req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, props] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['layer2s', 'risk', 'sequencing', 'entries'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      getLayer2sRiskSequencingEntries,
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
          image: '/meta-images/layer2s/risks/sequencing/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'Layer2sRiskSequencingPage',
      props: {
        ...appLayoutProps,
        ...props,
      },
    },
  }
}
