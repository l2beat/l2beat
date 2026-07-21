import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getLayer2sArchivedEntries } from '~/server/features/layer2s/archived/getLayer2sArchivedEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getLayer2sArchivedData(
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
      getLayer2sArchivedEntries,
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
      page: 'Layer2sArchivedPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
