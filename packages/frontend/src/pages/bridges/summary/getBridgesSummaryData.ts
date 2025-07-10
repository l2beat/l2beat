import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getBridgesSummaryEntries } from '~/server/features/bridges/getBridgesSummaryEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'

export async function getBridgesSummaryData(
  manifest: Manifest,
  url: string,
): Promise<RenderData> {
  const helpers = getSsrHelpers()

  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    getBridgesSummaryEntries(),
    helpers.tvs.chart.prefetch({
      range: { type: '1y' },
      filter: { type: 'bridge' },
      excludeAssociatedTokens: false,
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
