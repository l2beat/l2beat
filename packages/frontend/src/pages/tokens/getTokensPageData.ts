import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getTokenGraphTilesPage } from '~/server/features/tokens/getTokenGraphTilesPage'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getTokensPageData(
  manifest: Manifest,
  url: string,
  cache: InMemoryCache,
): Promise<RenderData> {
  // Only the first page is server-rendered; the whole catalogue is ~3.5MB of
  // cards, which has no business travelling in an HTML document.
  const [appLayoutProps, firstPage] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      { key: ['tokens'], ttl: 5 * 60, staleWhileRevalidate: 25 * 60 },
      () => getTokenGraphTilesPage({}),
    ),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Tokens - L2BEAT',
        description:
          'See how every token exists across chains — which deployments are backed by another, and which are in a burn-mint relation.',
        url,
        openGraph: { image: '/meta-images/tokens/opengraph-image.png' },
      }),
    },
    ssr: {
      page: 'TokensPage',
      props: { ...appLayoutProps, firstPage },
    },
  }
}
