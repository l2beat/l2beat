import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ICache } from '~/server/cache/ICache'
import { getScalingArchivedEntries } from '~/server/features/scaling/archived/getScalingArchivedEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingArchivedData(
  req: Request,
  manifest: Manifest,
  cache: ICache,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['scaling', 'archived', 'entries'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      getScalingArchivedEntries,
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        openGraph: {
          url: req.originalUrl,
          image: '/meta-images/scaling/archived/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'ScalingArchivedPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
