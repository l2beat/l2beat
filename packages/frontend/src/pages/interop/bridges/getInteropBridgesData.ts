import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getBridgeComparisonData } from '~/server/features/scaling/interop/getBridgeComparisonData'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getInteropBridgesData(
  _req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()

  const bridgeData = await cache.get(
    {
      key: ['interop', 'bridges', 'data'],
      ttl: 10 * 60,
      staleWhileRevalidate: 50 * 60,
    },
    () => getBridgeComparisonData(),
  )

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        openGraph: {
          url: '/interop/intent',
          image: '/meta-images/interop/summary/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'InteropBridgesPage',
      props: {
        ...appLayoutProps,
        ...bridgeData,
      },
    },
  }
}
