import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getTokenGraphTilesPage } from '~/server/features/tokens/getTokenGraphTilesPage'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export async function getTokensPageData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const [appLayoutProps, firstPage] = await Promise.all([
    getAppLayoutProps(),
    getTokenGraphTilesPage({}),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Tokens - L2BEAT',
        description:
          'How every token exists across chains: which deployments are backed by another, and which are in a burn-and-mint relation.',
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
