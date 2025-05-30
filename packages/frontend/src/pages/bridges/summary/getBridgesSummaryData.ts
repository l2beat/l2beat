import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getBridgesSummaryEntries } from '~/server/features/bridges/get-bridges-summary-entries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getExpressHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getBridgesSummaryData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const helpers = getExpressHelpers()

  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getBridgesSummaryEntries(),
    helpers.tvs.chart.prefetch({
      range: '1y',
      filter: { type: 'bridge' },
      excludeAssociatedTokens: false,
      previewRecategorisation: false,
    }),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        openGraph: {
          url,
          image: '/meta-images/bridges/summary/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'BridgesSummaryPage',
      props: {
        ...appLayoutProps,
        entries,
        queryState: helpers.dehydrate(),
      },
    },
  }
}
