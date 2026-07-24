import type {
  PrivacyAttribute,
  PrivacyExitWindow,
  PrivacySummaryValue,
  ProjectRedWarning,
} from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import type { ProjectLink } from '~/components/projects/links/types'
import type { BadgeWithParams } from '~/components/projects/ProjectBadge'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { ps } from '~/server/projects'
import type { SsrHelpers } from '~/trpc/server'
import { manifest } from '~/utils/Manifest'
import { getContractsSection } from '~/utils/project/contracts-and-permissions/getContractsSection'
import { getContractUtils } from '~/utils/project/contracts-and-permissions/getContractUtils'
import { getPermissionsSection } from '~/utils/project/contracts-and-permissions/getPermissionsSection'
import { getBadgeWithParams } from '~/utils/project/getBadgeWithParams'
import { getProjectLinks } from '~/utils/project/getProjectLinks'
import { getVerifiersSection } from '~/utils/project/getVerifiersSection'
import { type ChartRange, optionToRange } from '~/utils/range/range'
import type { ProjectsChangeReport } from '../../projects-change-report/getProjectsChangeReport'
import type { SevenDayTvsBreakdown } from '../../scaling/tvs/get7dTvsBreakdown'
import { get7dTvsBreakdown } from '../../scaling/tvs/get7dTvsBreakdown'
import type { PrivacyProjectDetails } from '../getPrivacyProjectDetails'
import {
  getPrivacyTrustedSetup,
  getPrivacyTrustedSetupsSection,
  toTrustedSetupSummaryValue,
} from '../utils/getPrivacyTrustedSetup'

export interface ProjectPrivacyEntry {
  id: ProjectId
  slug: string
  name: string
  shortName?: string
  icon: string
  description: string
  badges: BadgeWithParams[]
  projectLinks: ProjectLink[]
  discoveryHref?: string
  discoUi: {
    href: string
    images: {
      desktop: string
      mobile: string
    }
  }
  bucketCount: number
  assetsCount: number
  attributes: PrivacyAttribute[]
  exitWindow: PrivacyExitWindow
  trustedSetup: PrivacySummaryValue
  privacy: PrivacySummaryValue
  reproducibility: PrivacySummaryValue
  summary: {
    totalValueLockedUsd: number
    deposits: {
      total: number
      last7d: number
      last30d: number
    }
  }
  isUnderReview: boolean
  warnings: {
    yellow?: string
    red?: ProjectRedWarning
    emergency?: string
  }
  sections: ProjectDetailsSection[]
}

const EMPTY_PROJECTS_CHANGE_REPORT: ProjectsChangeReport = {
  projects: {},
  getChanges: () => ({
    impactfulChange: false,
    becameVerifiedContracts: {},
  }),
  hasImplementationChanged: () => false,
  hasHighSeverityFieldChanged: () => false,
  hasUltimateUpgraderChanged: () => false,
  getBecameVerifiedContracts: () => ({}),
}

const EMPTY_TVS_BREAKDOWN: SevenDayTvsBreakdown = {
  total: 0,
  projects: {},
}

export async function getPrivacyProjectEntry(
  details: PrivacyProjectDetails,
  helpers: SsrHelpers,
): Promise<ProjectPrivacyEntry> {
  const defaultChartRange = optionToRange('1y')
  const [
    contractUtils,
    allProjectsWithContracts,
    allProjects,
    tvs,
    zkCatalogProjects,
    totalValueLockedUsd,
  ] = await Promise.all([
    getContractUtils(),
    ps.getProjects({
      select: ['contracts'],
    }),
    ps.getProjects({
      optional: [
        'display',
        'daBridge',
        'scalingInfo',
        'daLayer',
        'privacyInfo',
      ],
    }),
    get7dTvsBreakdown({ type: 'all' }),
    ps.getProjects({
      select: ['zkCatalogInfo'],
    }),
    getTotalValueLockedUsd(details, helpers, defaultChartRange),
  ])

  const permissionsSection = getPermissionsSection(
    {
      id: details.id,
      permissions: details.permissions,
      isUnderReview: !!details.statuses.reviewStatus,
    },
    contractUtils,
    EMPTY_PROJECTS_CHANGE_REPORT,
  )

  const contractsSection = getContractsSection(
    {
      id: details.id,
      slug: details.slug,
      contracts: details.contracts,
      isVerified: true,
      isUnderReview: !!details.statuses.reviewStatus,
    },
    contractUtils,
    EMPTY_PROJECTS_CHANGE_REPORT,
    zkCatalogProjects,
    allProjectsWithContracts,
    EMPTY_TVS_BREAKDOWN,
  )

  const discoUi = {
    href: `https://disco.l2beat.com/ui/p/${details.id}`,
    images: {
      desktop: manifest.getUrl('/images/disco-ui-desktop.png'),
      mobile: manifest.getUrl('/images/disco-ui-mobile.png'),
    },
  }
  const icon = manifest.getUrl(`/icons/${details.slug}.png`)
  const hasTrackedAssets = details.assets.length > 0
  const discoveryHref =
    contractsSection || permissionsSection ? discoUi.href : undefined

  const sections: ProjectDetailsSection[] = []

  if (details.display.detailedDescription) {
    sections.push({
      type: 'DetailedDescriptionSection',
      props: {
        id: 'detailed-description',
        title: 'Protocol description',
        description: undefined,
        detailedDescription: details.display.detailedDescription,
      },
    })
  }

  if (hasTrackedAssets) {
    const chartProject = {
      id: details.id,
      name: details.name,
      shortName: details.shortName,
      iconUrl: icon,
    }

    sections.push({
      type: 'PrivacyTvlSection',
      props: {
        id: 'privacy-tvl',
        title: 'Value Locked',
        defaultRange: defaultChartRange,
        project: chartProject,
      },
    })

    sections.push({
      type: 'PrivacyFlowsSection',
      props: {
        id: 'privacy-flows',
        title: 'Flows',
        defaultRange: defaultChartRange,
        project: chartProject,
      },
    })

    sections.push({
      type: 'PrivacyAssetsBreakdownSection',
      props: {
        id: 'privacy-assets-breakdown',
        title: 'Assets Breakdown',
        assets: details.assets,
      },
    })
  }

  if (details.riskSummary) {
    sections.push({
      type: 'MarkdownSection',
      sideNavTitle: 'Risk summary',
      props: {
        id: 'risk-summary',
        title: 'Risk summary',
        content: details.riskSummary,
        mdClassName:
          '[&_h2]:mb-0 [&_h2]:font-bold [&_h2]:text-red-300 [&_h2]:text-paragraph-15 md:[&_h2]:text-paragraph-16 [&_ol]:mb-0 [&_ol]:list-inside [&_ol]:pl-1.5 [&_li]:ml-0',
      },
    })
  }

  if (details.upgradesAndGovernance) {
    sections.push({
      type: 'MarkdownSection',
      props: {
        id: 'upgrades-and-governance',
        title: 'Upgrades & Governance',
        content: details.upgradesAndGovernance,
      },
    })
  }

  sections.push({
    type: 'TrustedSetupSection',
    props: {
      id: 'trusted-setups',
      title: 'Trusted setup',
      ...getPrivacyTrustedSetupsSection(details.zkCatalogInfo),
    },
  })

  if (
    details.zkCatalogInfo?.verifierHashes &&
    details.zkCatalogInfo.verifierHashes.length > 0
  ) {
    const verifiersSection = await getVerifiersSection(
      details.zkCatalogInfo.verifierHashes,
      contractUtils,
      allProjects,
      tvs,
    )

    sections.push({
      type: 'VerifiersSection',
      props: {
        id: 'verifiers',
        title: 'Verifier IDs',
        variant: 'privacy',
        ...verifiersSection,
      },
    })
  }

  if (permissionsSection) {
    sections.push({
      type: 'PermissionsSection',
      props: {
        ...permissionsSection,
        id: 'permissions',
        title: 'Permissions',
        discoUi,
      },
    })
  }

  if (contractsSection) {
    sections.push({
      type: 'ContractsSection',
      props: {
        ...contractsSection,
        id: 'contracts',
        title: 'Smart contracts',
        discoUi,
      },
    })
  }

  return {
    id: details.id,
    slug: details.slug,
    name: details.name,
    shortName: details.shortName,
    icon,
    description: details.display.description,
    badges: details.display.badges.flatMap((badge) => {
      const badgeWithParams = getBadgeWithParams(badge)
      return badgeWithParams ? [badgeWithParams] : []
    }),
    projectLinks: getProjectLinks(details.display.links),
    discoveryHref,
    discoUi,
    bucketCount: details.summary.bucketCount,
    assetsCount: details.assets.length,
    attributes: details.attributes,
    exitWindow: details.exitWindow,
    trustedSetup: toTrustedSetupSummaryValue(
      getPrivacyTrustedSetup(details.zkCatalogInfo),
    ),
    privacy: details.privacy,
    reproducibility: details.reproducibility,
    summary: {
      totalValueLockedUsd,
      deposits: details.summary.deposits,
    },
    isUnderReview: !!details.statuses.reviewStatus,
    warnings: {
      yellow: details.statuses.yellowWarning,
      red: details.statuses.redWarning,
      emergency: details.statuses.emergencyWarning,
    },
    sections,
  }
}

async function getTotalValueLockedUsd(
  details: PrivacyProjectDetails,
  helpers: SsrHelpers,
  range: ChartRange,
): Promise<number> {
  if (details.assets.length === 0) {
    return 0
  }

  // The flows chart prefetch rides along so both charts are dehydrated for the client
  const [tvlChart] = await Promise.all([
    helpers.queryClient.fetchQuery(
      helpers.trpc.privacy.tvlChart.queryOptions({
        projectIds: [details.id],
        range,
      }),
    ),
    helpers.queryClient.prefetchQuery(
      helpers.trpc.privacy.flowsChart.queryOptions({
        projectIds: [details.id],
        range,
      }),
    ),
  ])

  return tvlChart.chart.at(-1)?.[1][details.id] ?? 0
}
