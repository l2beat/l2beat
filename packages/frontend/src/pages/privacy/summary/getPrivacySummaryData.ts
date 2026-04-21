import type { TrustedSetup } from '@l2beat/config'
import type { InMemoryCache } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import { getPrivacySnapshot } from '~/server/features/privacy/getPrivacySnapshot'
import { getMetadata } from '~/ssr/head/getMetadata'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'

export interface PrivacySummaryEntry {
  id: string
  slug: string
  name: string
  shortName?: string
  icon: string
  href: string
  description: string
  totalValueLockedUsd: number
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
  const [appLayoutProps, snapshot] = await Promise.all([
    getAppLayoutProps(),
    getPrivacySnapshot(cache),
  ])

  const entries: PrivacySummaryEntry[] = snapshot.projects.map((project) => ({
    id: project.id,
    slug: project.slug,
    name: project.name,
    shortName: project.shortName,
    icon: manifest.getUrl(`/icons/${project.slug}.png`),
    href: `/privacy/projects/${project.slug}`,
    description: project.display.description,
    totalValueLockedUsd: project.summary.totalValueSecuredUsd,
    poolsTracked: project.summary.bucketCount,
    totalDeposits: project.summary.deposits.total,
    totalValueDeposited30dUsd: project.summary.depositedValueUsd.last30d,
    totalDeposits30d: project.summary.deposits.last30d,
    isUnderReview: !!project.statuses.reviewStatus,
    trustedSetup: project.trustedSetup,
  }))

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: 'Privacy Dashboard - L2BEAT',
        description:
          'Track live balances and deposit activity for Railgun, Privacy Pools, and Tornado Cash.',
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
        overview: snapshot.overview,
      },
    },
  }
}
