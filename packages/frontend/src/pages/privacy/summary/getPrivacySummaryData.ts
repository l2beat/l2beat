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
  totalValueLockedUsd: number
  poolsTracked: number
  totalDeposits: number
  attributes: PrivacySummaryAttribute[]
  isUnderReview: boolean
  trustedSetup: TrustedSetup
}

export type PrivacySummaryAttributeId =
  | 'upgradeable'
  | 'opt-compliance'
  | 'transfers'
  | 'defi'
  | 'any-amount'
  | 'fixed-amounts'
  | 'open-source'
  | 'immutable'
  | 'uncensorable'
  | 'enforced-compliance'

export interface PrivacySummaryAttribute {
  id: PrivacySummaryAttributeId
  label: string
  description: string
}

const PRIVACY_ATTRIBUTES: Record<
  PrivacySummaryAttributeId,
  PrivacySummaryAttribute
> = {
  upgradeable: {
    id: 'upgradeable',
    label: 'upgradeable',
    description:
      'DAO can vote on upgrades that are executable with a 7d delay.',
  },
  'opt-compliance': {
    id: 'opt-compliance',
    label: 'opt compliance',
    description:
      "Optional 'proofs of innocence' (POIs), can disassociate the deposit from a list of flagged addresses.",
  },
  transfers: {
    id: 'transfers',
    label: 'transfers',
    description: 'Private transfers within the shielded pool.',
  },
  defi: {
    id: 'defi',
    label: 'DeFi',
    description:
      'Interop with DeFi (swaps, vaults) from within the shielded pool.',
  },
  'any-amount': {
    id: 'any-amount',
    label: 'any amount',
    description: 'Deposits and withdrawals can have any size.',
  },
  'fixed-amounts': {
    id: 'fixed-amounts',
    label: 'fixed amounts',
    description:
      'Pre-defined transfer amounts use distinct buckets (anonymity sets).',
  },
  'open-source': {
    id: 'open-source',
    label: 'open source',
    description:
      'There is at least one practical way to use exclusively open source software to interact with this protocol.',
  },
  immutable: {
    id: 'immutable',
    label: 'immutable',
    description: 'Core smart contract code cannot be changed.',
  },
  uncensorable: {
    id: 'uncensorable',
    label: 'uncensorable',
    description: 'Deposits and withdrawals cannot be censored.',
  },
  'enforced-compliance': {
    id: 'enforced-compliance',
    label: 'enforced compliance',
    description:
      'ASPs (association set providers) can censor any deposits, excluding them from the anonymity set.',
  },
}

const PRIVACY_ATTRIBUTES_BY_PROJECT: Record<string, PrivacySummaryAttribute[]> =
  {
    railgun: [
      PRIVACY_ATTRIBUTES.upgradeable,
      PRIVACY_ATTRIBUTES['opt-compliance'],
      PRIVACY_ATTRIBUTES.transfers,
      PRIVACY_ATTRIBUTES.defi,
      PRIVACY_ATTRIBUTES['any-amount'],
      PRIVACY_ATTRIBUTES['open-source'],
    ],
    'tornado-cash': [
      PRIVACY_ATTRIBUTES.immutable,
      PRIVACY_ATTRIBUTES.uncensorable,
      PRIVACY_ATTRIBUTES['fixed-amounts'],
      PRIVACY_ATTRIBUTES['open-source'],
    ],
    'privacy-pools': [
      PRIVACY_ATTRIBUTES.immutable,
      PRIVACY_ATTRIBUTES['enforced-compliance'],
      PRIVACY_ATTRIBUTES['any-amount'],
      PRIVACY_ATTRIBUTES['open-source'],
    ],
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
    totalValueLockedUsd: project.summary.totalValueSecuredUsd,
    poolsTracked: project.summary.bucketCount,
    totalDeposits: project.summary.deposits.total,
    attributes: PRIVACY_ATTRIBUTES_BY_PROJECT[project.slug] ?? [],
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
