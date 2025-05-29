import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ICache } from '~/server/cache/ICache'
import { getScalingLivenessEntries } from '~/server/features/scaling/liveness/get-scaling-liveness-entries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingLivenessData(
  req: Request,
  manifest: Manifest,
  cache: ICache,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['scaling', 'liveness', 'entries'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      getScalingLivenessEntries,
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        openGraph: {
          url: req.originalUrl,
          image: '/meta-images/scaling/liveness/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'ScalingLivenessPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
