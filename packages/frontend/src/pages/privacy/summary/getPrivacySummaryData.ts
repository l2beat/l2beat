import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getPrivacySummaryEntries } from '~/server/features/privacy/getPrivacySummaryEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { optionToRange } from '~/utils/range/range'

export async function getPrivacySummaryData(
  manifest: Manifest,
  url: string,
  cache: InMemoryCache,
): Promise<RenderData> {
  const helpers = getSsrHelpers()
  const defaultChartRange = optionToRange('1y')
  const [appLayoutProps, entries] = await Promise.all([
    getAppLayoutProps(),
    cache.get(
      {
        key: ['privacy', 'summary', 'entries'],
        ttl: 60,
        staleWhileRevalidate: 5 * 60,
      },
      () => getPrivacySummaryEntries(),
    ),
    helpers.privacy.summaryChart.prefetch({
      range: defaultChartRange,
    }),
  ])

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Privacy - L2BEAT',
        description:
          'Track live balances and daily privacy flows across tracked privacy protocols.',
        url,
        openGraph: {
          image: '/meta-images/privacy/summary/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'PrivacySummaryPage',
      props: {
        ...appLayoutProps,
        entries,
        defaultChartRange,
        queryState: helpers.dehydrate(),
      },
    },
  }
}
