import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getL2RiskEntries } from '~/server/features/layer2s/risks/getL2RiskEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getBadgeLookup } from '~/utils/project/getBadgeWithParams'

export async function getL2RiskData(
  req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['layer2s', 'risk', 'entries'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      getL2RiskEntries,
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        name: 'Risk analysis',
        description:
          'Understand the risks of Ethereum scaling solutions using ETHBEAT’s assessments.',
        url: req.originalUrl,
        openGraph: {
          image: '/meta-images/layer2s/risks/overview/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'L2RiskPage',
      props: {
        ...appLayoutProps,
        entries,
        badgeLookup: getBadgeLookup(entries),
      },
    },
  }
}
