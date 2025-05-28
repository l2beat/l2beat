import type { Request } from 'express'
import { getAppLayoutProps } from 'rewrite/src/common/getAppLayoutProps'
import type { ICache } from 'rewrite/src/server/cache/ICache'
import { getScalingLivenessEntries } from 'rewrite/src/server/features/scaling/liveness/get-scaling-liveness-entries'
import { parseCookies } from 'rewrite/src/server/utils/parseCookies'
import { getMetadata } from 'rewrite/src/ssr/head/getMetadata'
import type { RenderData } from 'rewrite/src/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingLivenessData(
  req: Request,
  manifest: Manifest,
  cache: ICache,
): Promise<RenderData> {
  const cookies = parseCookies(req)
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps({
      recategorisationPreview: cookies.recategorisationPreview,
    }),
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
