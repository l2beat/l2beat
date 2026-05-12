import type { TrustedSetup } from '@l2beat/config'
import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getPrivacySnapshot } from '~/server/features/privacy/getPrivacySnapshot'
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
  const [appLayoutProps, snapshot] = await Promise.all([
    getAppLayoutProps(),
    getPrivacySnapshot(cache),
  ])

  await helpers.privacy.summaryChart.prefetch({
    range: defaultChartRange,
  })

  const entries: PrivacySummaryEntry[] = snapshot.projects.map((project) => ({
    id: project.id,
    slug: project.slug,
    name: project.name,
    shortName: project.shortName,
    icon: manifest.getUrl(`/icons/${project.slug}.png`),
    href: `/privacy/projects/${project.slug}`,
    description: project.display.description,
    totalValueSecuredUsd: project.summary.totalValueSecuredUsd ?? 0,
    poolsTracked: project.summary.bucketCount ?? 0,
    totalDeposits: project.summary.deposits.total ?? 0,
    totalValueDeposited30dUsd: project.summary.depositedValueUsd.last30d ?? 0,
    totalDeposits30d: project.summary.deposits.last30d ?? 0,
    isUnderReview: !!project.statuses.reviewStatus,
    trustedSetup: project.trustedSetup,
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
        entries,
        defaultChartRange,
        queryState: helpers.dehydrate(),
      },
    },
  }
}
