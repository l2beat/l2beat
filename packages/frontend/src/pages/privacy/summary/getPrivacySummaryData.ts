import type { TrustedSetup } from '@l2beat/config'
import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getPrivacySummaryEntries } from '~/server/features/privacy/getPrivacySummaryEntries'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { optionToRange } from '~/utils/range/range'

export interface PrivacySummaryEntry {
  id: string
  slug: string
  name: string
  shortName?: string
  icon: string
  href: string
  description: string
  totalValueSecuredUsd: number
  poolsTracked: number
  totalDeposits: number
  totalValueDeposited30dUsd: number
  totalDeposits30d: number
  isUnderReview: boolean
  trustedSetup: TrustedSetup
}

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

  const mappedEntries: PrivacySummaryEntry[] = entries.map((entry) => ({
    id: entry.id,
    slug: entry.slug,
    name: entry.name,
    shortName: entry.shortName,
    icon: manifest.getUrl(`/icons/${entry.slug}.png`),
    href: `/privacy/projects/${entry.slug}`,
    description: entry.description,
    totalValueSecuredUsd: entry.totalValueSecuredUsd,
    poolsTracked: entry.poolsTracked,
    totalDeposits: entry.totalDeposits,
    totalValueDeposited30dUsd: entry.totalValueDeposited30dUsd,
    totalDeposits30d: entry.totalDeposits30d,
    isUnderReview: entry.isUnderReview,
    trustedSetup: entry.trustedSetup,
  }))

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Privacy Dashboard - L2BEAT',
        description:
          'Track live balances and daily privacy flows across tracked privacy protocols.',
        url,
        openGraph: {
          image: '/meta-images/data-availability/summary/opengraph-image.png',
        },
      }),
    },
    ssr: {
      page: 'PrivacySummaryPage',
      props: {
        ...appLayoutProps,
        entries: mappedEntries,
        defaultChartRange,
        queryState: helpers.dehydrate(),
      },
    },
  }
}
