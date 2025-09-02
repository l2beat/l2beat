import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ICache } from '~/server/cache/ICache'
import { getAllTokensEntries } from '~/server/features/scaling/tvs/breakdown/getAllTokenEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getScalingTvsBreakdownData(
  req: Request,
  manifest: Manifest,
  cache: ICache,
): Promise<RenderData> {
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['scaling', 'tvs', 'breakdown', 'data'],
        ttl: 5 * 60,
        staleWhileRevalidate: 25 * 60,
      },
      () => getAllTokensEntries(),
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Global TVS Breakdown - L2BEAT',
        description:
          'Track total value secured across Ethereum scaling solutions.',
        openGraph: {
          url: req.originalUrl,
          image: '/meta-images/scaling/value-secured/opengraph-image.png',
        },
        excludeFromSearchEngines: true,
      }),
    },
    ssr: {
      page: 'ScalingTvsBreakdownPage',
      props: {
        ...appLayoutProps,
        entries,
      },
    },
  }
}
