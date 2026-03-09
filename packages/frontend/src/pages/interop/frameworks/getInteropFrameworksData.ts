import type { InMemoryCache } from '@l2beat/shared-pure'
import type { Request } from 'express'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getFrameworkComparisonData } from '~/server/features/scaling/interop/getFrameworkComparisonData'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getInteropFrameworksData(
  _req: Request,
  manifest: Manifest,
  cache: InMemoryCache,
): Promise<RenderData> {
  const appLayoutProps = await getAppLayoutProps()

  const frameworkData = await cache.get(
    {
      key: ['interop', 'frameworks', 'data'],
      ttl: 10 * 60,
      staleWhileRevalidate: 50 * 60,
    },
    () => getFrameworkComparisonData(),
  )

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        openGraph: {
          url: '/interop/frameworks',
          image: '/meta-images/interop/summary/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'InteropFrameworksPage',
      props: {
        ...appLayoutProps,
        ...frameworkData,
      },
    },
  }
}
