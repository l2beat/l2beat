import type {
  PrivacyAttribute,
  PrivacyExitWindow,
  PrivacySummaryValue,
  ProjectRedWarning,
} from '@l2beat/config'
import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ProjectIconListItem } from '~/components/ProjectIconList'
import type { ProjectLink } from '~/components/projects/links/types'
import type { BadgeWithParams } from '~/components/projects/ProjectBadge'
import type { SectionChain } from '~/components/projects/sections/SectionChainBadge'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { PRIVACY_ADVERSARIES_SECTION_ID } from '~/pages/privacy/adversaries/privacyAdversaryUi'
import { getGardenCropsSection } from '~/server/features/garden/getGardenCropsSection'
import { getUpdatesSection } from '~/server/features/projects/discovery-updates/getUpdatesSection'
import { countRecentDiscoveryUpdates } from '~/server/features/projects/recent-changes/discoveryUpdates'
import { ps } from '~/server/projects'
import type { SsrHelpers } from '~/trpc/server'
import { manifest } from '~/utils/Manifest'
import { getContractsSection } from '~/utils/project/contracts-and-permissions/getContractsSection'
import { getContractUtils } from '~/utils/project/contracts-and-permissions/getContractUtils'
import { getPermissionsSection } from '~/utils/project/contracts-and-permissions/getPermissionsSection'
import { getBadgeWithParams } from '~/utils/project/getBadgeWithParams'
import { getProjectLinks } from '~/utils/project/getProjectLinks'
import { PROJECT_PAGE_METADATA_FIELDS } from '~/utils/project/getProjectUrl'
import { getTrustedSetupsSectionFromTrustedSetups } from '~/utils/project/getTrustedSetupsSection'
import { getVerifiersSection } from '~/utils/project/getVerifiersSection'
import { optionToRange } from '~/utils/range/range'
import {
  EMPTY_TVS_BREAKDOWN,
  get7dTvsBreakdown,
} from '../../layer2s/tvs/get7dTvsBreakdown'
import { EMPTY_PROJECTS_CHANGE_REPORT } from '../../projects-change-report/getProjectsChangeReport'
import type { PrivacyProjectDetails } from '../getPrivacyProjectDetails'
import type { PrivacyRelayerStat } from '../types'
import { getPrivacyChainPagePath } from '../utils/getPrivacyPageChains'
import {
  getPrivacyReferenceApp,
  type PrivacyReferenceApp,
} from '../utils/getPrivacyReferenceApp'
import {
  getPrivacyTrustedSetup,
  type PrivacyTrustedSetupSummary,
  toTrustedSetupSummaryValue,
} from '../utils/getPrivacyTrustedSetup'
import { resolvePrivacySources } from '../utils/resolvePrivacySources'

/** A tab of a project that is shown one tracked chain at a time. */
export interface PrivacyChainTab extends SectionChain {
  /** The page of the project on this chain. */
  href: string
}

export interface ProjectPrivacyEntry {
  id: ProjectId
  slug: string
  /** This page: the project's, or the project's on the selected chain. */
  href: string
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
  trackedOn: ProjectIconListItem[]
  scalingProjects: ProjectIconListItem[]
  exitWindow: PrivacyExitWindow
  trustedSetup: PrivacyTrustedSetupSummary
  reproducibility: PrivacySummaryValue
  referenceApp?: PrivacyReferenceApp
  summary: {
    totalValueLockedUsd: number | undefined
    totalValueLockedChange7d: number | undefined
    deposits: {
      total: number
      last7d: number
      change7d: number
      last30d: number
    }
    relayerStat?: PrivacyRelayerStat
  }
  /**
   * Set when the project is shown one tracked chain at a time: the stats, the
   * risks and the sections that name the chain are then the selected chain's.
   */
  chainView?: {
    chains: PrivacyChainTab[]
    selected: SectionChain
    /** Value locked on every tracked chain. */
    totalValueLockedUsd: number | undefined
  }
  archivedAt?: UnixTime
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
  const [contractUtils, allProjects, tvs] = await Promise.all([
    getContractUtils(),
    ps.getProjects({
      optional: ['display', ...PROJECT_PAGE_METADATA_FIELDS],
    }),
    get7dTvsBreakdown({ type: 'all' }),
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
    href: `https://disco.ethbeat.org/ui/p/${details.id}`,
    images: {
      desktop: manifest.getUrl('/images/disco-ui-desktop.png'),
      mobile: manifest.getUrl('/images/disco-ui-mobile.png'),
    },
  }
  const icon = manifest.getUrl(`/icons/${details.slug}.png`)
  const referenceApp =
    details.referenceApp && getPrivacyReferenceApp(details.referenceApp, icon)
  const hasTrackedAssets = details.assets.length > 0
  const discoveryHref =
    contractsSection || permissionsSection ? discoUi.href : undefined
  const discoveryUpdates = details.discoveryUpdates ?? []

  const sections: ProjectDetailsSection[] = []

  const gardenCropsSection = await getGardenCropsSection(
    details,
    details.ossification,
  )
  if (gardenCropsSection) {
    sections.push(gardenCropsSection)
  }

  if (details.detailedDescription) {
    sections.push({
      type: 'DetailedDescriptionSection',
      props: {
        id: 'detailed-description',
        title: 'Protocol description',
        description: undefined,
        detailedDescription: details.detailedDescription,
      },
    })
  }

  // Filled in once every other section exists, so that its source links can
  // point only at sections this page renders.
  const adversariesSectionIndex = sections.length

  const pageChains = details.chainView?.chains.map((c) => c.id) ?? []
  const toSectionChain = ({ id, name, iconUrl }: SectionChain) => ({
    id,
    name,
    iconUrl,
  })
  const toChainTab = (c: SectionChain): PrivacyChainTab => ({
    ...toSectionChain(c),
    href: getPrivacyChainPagePath(details.slug, pageChains, c.id),
  })
  // Sections about one chain name it in their header.
  const chain = details.chainView && toSectionChain(details.chainView.selected)
  const href = chain
    ? getPrivacyChainPagePath(details.slug, pageChains, chain.id)
    : `/privacy/projects/${details.slug}`

  const chartProject = {
    id: details.id,
    name: details.name,
    shortName: details.shortName,
    iconUrl: icon,
  }

  if (details.hasTvl) {
    const valueSection = {
      id: 'privacy-tvl',
      title: 'Value Locked',
      defaultRange: defaultChartRange,
      project: chartProject,
      milestones: details.milestones,
    } as const
    sections.push(
      details.chainView && chain
        ? {
            type: 'PrivacyValueLockedSection',
            props: {
              ...valueSection,
              chains: details.chainView.chains.map(toChainTab),
              pageChain: chain.id,
            },
          }
        : {
            type: 'TvsValueSection',
            props: { ...valueSection, rangeControls: 'privacy' },
          },
    )
  }

  if (details.anonymitySetType !== undefined) {
    sections.push({
      type: 'PrivacyAnonymitySetSection',
      props: {
        id: 'privacy-anonymity-set',
        title: 'Anonymity sets',
        defaultRange: defaultChartRange,
        project: chartProject,
        milestones: details.milestones,
        anonymitySetType: details.anonymitySetType,
        chain,
      },
    })
  }

  if (hasTrackedAssets) {
    sections.push({
      type: 'PrivacyFlowsSection',
      props: {
        id: 'privacy-flows',
        title: 'Flows',
        defaultRange: defaultChartRange,
        project: chartProject,
        milestones: details.milestones,
        chain,
      },
    })

    sections.push({
      type: 'PrivacyAssetsBreakdownSection',
      props: {
        id: 'privacy-assets-breakdown',
        title: 'Assets Breakdown',
        assets: details.assets,
        showTvl: details.hasTvl,
        chain,
      },
    })
  }

  if (details.milestones.length > 0) {
    sections.push({
      type: 'MilestonesAndIncidentsSection',
      props: {
        id: 'milestones-and-incidents',
        title: 'Milestones & Incidents',
        milestones: details.milestones,
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
        chain,
        content: details.riskSummary,
        mdClassName:
          '[&_.mdc-h2]:mb-0 [&_.mdc-h2]:font-bold [&_.mdc-h2]:text-red-300 [&_.mdc-h2]:text-paragraph-15 md:[&_.mdc-h2]:text-paragraph-16 [&_ol]:mb-0 [&_ol]:list-inside [&_ol]:pl-1.5 [&_li]:ml-0',
      },
    })
  }

  if (details.upgradesAndGovernance) {
    sections.push({
      type: 'UpgradesAndGovernanceSection',
      props: {
        id: 'upgrades-and-governance',
        title: 'Upgrades & Governance',
        chain,
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

  const updatesSection = await getUpdatesSection(
    helpers,
    details.id,
    discoveryUpdates,
    details.ossification,
  )
  if (updatesSection) {
    sections.push(updatesSection)
  }

  if (permissionsSection) {
    sections.push({
      type: 'PermissionsSection',
      props: {
        ...permissionsSection,
        id: 'permissions',
        title: 'Permissions',
        chain,
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
        chain,
        discoUi,
      },
    })
  }

  sections.splice(adversariesSectionIndex, 0, {
    type: 'PrivacyAdversariesSection',
    props: {
      id: PRIVACY_ADVERSARIES_SECTION_ID,
      title: 'Privacy',
      chain,
      isUnderReview: !!details.statuses.reviewStatus,
      adversaries: resolvePrivacySources(details.adversaries, sections),
      referenceApp,
    },
  })

  const totalValueLockedUsd = details.hasTvl
    ? tvs.projects[details.id]?.breakdown.total
    : undefined
  const allChainsValueLockedUsd = details.hasTvl
    ? details.chainView?.allChainsValueLockedUsd
    : undefined

  return {
    id: details.id,
    slug: details.slug,
    href,
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
    trackedOn: details.trackedOn,
    scalingProjects: details.scalingProjects,
    exitWindow: details.exitWindow,
    trustedSetup: toTrustedSetupSummaryValue(
      getPrivacyTrustedSetup(details.trustedSetups),
    ),
    reproducibility: details.reproducibility,
    referenceApp,
    summary: {
      totalValueLockedUsd: !details.hasTvl
        ? undefined
        : details.chainView
          ? details.chainView.totalValueLockedUsd
          : totalValueLockedUsd,
      totalValueLockedChange7d: !details.hasTvl
        ? undefined
        : details.chainView
          ? details.chainView.totalValueLockedChange7d
          : tvs.projects[details.id]?.change.total,
      deposits: details.summary.deposits,
      relayerStat: details.summary.relayerStat,
    },
    chainView: details.chainView &&
      chain && {
        chains: details.chainView.chains.map(toChainTab),
        selected: chain,
        totalValueLockedUsd: allChainsValueLockedUsd,
      },
    archivedAt: details.archivedAt,
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
