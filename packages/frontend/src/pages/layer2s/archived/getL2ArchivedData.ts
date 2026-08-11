import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getL2ArchivedEntries } from '~/server/features/layer2s/archived/getL2ArchivedEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getL2ArchivedData(
  req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['layer2s', 'archived', 'entries'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      getL2ArchivedEntries,
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        url: req.originalUrl,
        openGraph: {
          image: '/meta-images/layer2s/archived/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'L2ArchivedPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
