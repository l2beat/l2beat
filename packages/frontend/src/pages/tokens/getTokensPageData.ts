import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getTokensPageData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const helpers = getSsrHelpers()
  const [appLayoutProps] = await Promise.all([
    getAppLayoutProps(),
    helpers.queryClient.prefetchInfiniteQuery(
      helpers.trpc.tokens.tiles.infiniteQueryOptions(
        {},
        { getNextPageParam: (lastPage) => lastPage.nextCursor },
      ),
    ),
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
      props: { ...appLayoutProps, queryState: helpers.dehydrate() },
    },
  }
}
