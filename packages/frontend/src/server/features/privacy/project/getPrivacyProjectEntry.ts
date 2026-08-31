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
import {
  countRecentDiscoveryUpdates,
  getDiscoveryUpdates,
} from '~/server/features/projects/recent-changes/getDiscoveryUpdates'
import { ps } from '~/server/projects'
import type { SsrHelpers } from '~/trpc/server'
import { manifest } from '~/utils/Manifest'
import { getContractsSection } from '~/utils/project/contracts-and-permissions/getContractsSection'
import { getContractUtils } from '~/utils/project/contracts-and-permissions/getContractUtils'
import { getPermissionsSection } from '~/utils/project/contracts-and-permissions/getPermissionsSection'
import { getBadgeWithParams } from '~/utils/project/getBadgeWithParams'
import { getProjectLinks } from '~/utils/project/getProjectLinks'
import { getTrustedSetupsSectionFromTrustedSetups } from '~/utils/project/getTrustedSetupsSection'
import { getVerifiersSection } from '~/utils/project/getVerifiersSection'
import { type ChartRange, optionToRange } from '~/utils/range/range'
import {
  EMPTY_TVS_BREAKDOWN,
  get7dTvsBreakdown,
} from '../../layer2s/tvs/get7dTvsBreakdown'
import { EMPTY_PROJECTS_CHANGE_REPORT } from '../../projects-change-report/getProjectsChangeReport'
import type { PrivacyProjectDetails } from '../getPrivacyProjectDetails'
import type { PrivacyRelayerStat } from '../types'
import {
  getPrivacyTrustedSetup,
  type PrivacyTrustedSetupSummary,
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
  hasTvl: boolean
  attributes: PrivacyAttribute[]
  exitWindow: PrivacyExitWindow
  trustedSetup: PrivacyTrustedSetupSummary
  privacy: PrivacySummaryValue
  reproducibility: PrivacySummaryValue
  summary: {
    totalValueLockedUsd: number | undefined
    deposits: {
      total: number
      last7d: number
      last30d: number
    }
    relayerStat?: PrivacyRelayerStat
  }
  isUnderReview: boolean
  recentUpdatesCount: number
  warnings: {
    yellow?: string
    red?: ProjectRedWarning
    emergency?: string
  }
  sections: ProjectDetailsSection[]
}

export async function getPrivacyProjectEntry(
  details: PrivacyProjectDetails,
  helpers: SsrHelpers,
): Promise<ProjectPrivacyEntry> {
  const defaultChartRange = optionToRange('1y')
  const [contractUtils, allProjects, tvs, totalValueLockedUsd] =
    await Promise.all([
      getContractUtils(),
      ps.getProjects({
        optional: [
          'display',
          'daBridge',
          'scalingInfo',
          'daLayer',
          'privacyInfo',
          'defiInfo',
        ],
      }),
      get7dTvsBreakdown({ type: 'all' }),
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
    [],
    [],
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
  const discoveryUpdates = getDiscoveryUpdates(details.id)

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

  if (details.noteDiscovery) {
    sections.push({
      type: 'MarkdownSection',
      props: {
        id: 'note-discovery',
        title: 'Note discovery',
        content: details.noteDiscovery.description,
        risks: details.noteDiscovery.risks?.map((text) => ({
          text,
          isCritical: false,
        })),
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

    if (details.hasTvl) {
      sections.push({
        type: 'TvsValueSection',
        props: {
          id: 'privacy-tvl',
          title: 'Value Locked',
          defaultRange: defaultChartRange,
          rangeControls: 'privacy',
          project: chartProject,
        },
      })
    }

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
        showTvl: details.hasTvl,
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
      type: 'UpgradesAndGovernanceSection',
      props: {
        id: 'upgrades-and-governance',
        title: 'Upgrades & Governance',
        content: details.upgradesAndGovernance.content,
        governanceInfo: details.upgradesAndGovernance.governanceInfo,
      },
    })
  }

  if (details.trustedSetups.length > 0) {
    sections.push({
      type: 'TrustedSetupSection',
      props: {
        id: 'trusted-setups',
        title: 'Trusted setup',
        ...getTrustedSetupsSectionFromTrustedSetups(details.trustedSetups),
      },
    })
  }

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

  if (discoveryUpdates.length > 0) {
    sections.push({
      type: 'UpdatesSection',
      props: {
        id: 'updates',
        title: 'Updates',
        updates: discoveryUpdates,
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
    hasTvl: details.hasTvl,
    attributes: details.attributes,
    exitWindow: details.exitWindow,
    trustedSetup: toTrustedSetupSummaryValue(
      getPrivacyTrustedSetup(details.trustedSetups),
    ),
    privacy: details.privacy,
    reproducibility: details.reproducibility,
    summary: {
      totalValueLockedUsd,
      deposits: details.summary.deposits,
      relayerStat: details.summary.relayerStat,
    },
    isUnderReview: !!details.statuses.reviewStatus,
    recentUpdatesCount: countRecentDiscoveryUpdates(discoveryUpdates),
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
): Promise<number | undefined> {
  if (details.assets.length === 0) {
    return undefined
  }

  const flowsPrefetch = helpers.queryClient.prefetchQuery(
    helpers.trpc.privacy.flowsChart.queryOptions({
      projectIds: [details.id],
      range,
    }),
  )

  if (!details.hasTvl) {
    await flowsPrefetch
    return undefined
  }

  // The flows chart prefetch rides along so both charts are dehydrated for the client
  const [tvlChart] = await Promise.all([
    helpers.queryClient.fetchQuery(
      helpers.trpc.tvs.chartByProjects.queryOptions({
        projectIds: [details.id],
        range,
      }),
    ),
    flowsPrefetch,
  ])

  return tvlChart.chart.at(-1)?.[1][details.id] ?? undefined
}
