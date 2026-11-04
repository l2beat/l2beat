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
import {
  getPrivacyReferenceApp,
  type PrivacyReferenceApp,
} from '../utils/getPrivacyReferenceApp'
import type { PrivacyChainLink } from '../utils/getPrivacyTrackedChains'
import {
  getPrivacyTrustedSetup,
  type PrivacyTrustedSetupSummary,
  toTrustedSetupSummaryValue,
} from '../utils/getPrivacyTrustedSetup'
import { resolvePrivacySources } from '../utils/resolvePrivacySources'

export interface ProjectPrivacyEntry {
  id: ProjectId
  slug: string
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
  /** The tracked chain the page describes. */
  chain: string
  /** "on <Chain>", shown under the name when the project is tracked on several chains. */
  chainSubtitle?: string
  /** The tracked chains the page can switch to, in config order. */
  chains: PrivacyChainLink[]
  /** Every chain with a deployment; the untracked ones are dimmed. */
  deployedOn: ProjectIconListItem[]
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
    href: `https://disco.l2beat.com/ui/p/${details.id}`,
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

  const chartProject = {
    id: details.id,
    name: details.name,
    shortName: details.shortName,
    iconUrl: icon,
  }
  // Per-chain charts of a multi-chain project say which chain they show and
  // query only it. Single-chain pages are unchanged.
  const chainSubtitle = details.isMultiChain
    ? `on ${details.chainName}`
    : undefined
  const chartChain = details.isMultiChain ? details.chain : undefined

  if (details.hasTvl) {
    sections.push({
      type: 'TvsValueSection',
      props: {
        id: 'privacy-tvl',
        title: 'Value Locked',
        subtitle: chainSubtitle,
        defaultRange: defaultChartRange,
        rangeControls: 'privacy',
        project: chartProject,
        milestones: details.milestones,
        chain: chartChain,
      },
    })
  }

  if (details.anonymitySetType !== undefined) {
    sections.push({
      type: 'PrivacyAnonymitySetSection',
      props: {
        id: 'privacy-anonymity-set',
        title: 'Anonymity sets',
        subtitle: chainSubtitle,
        defaultRange: defaultChartRange,
        project: chartProject,
        milestones: details.milestones,
        anonymitySetType: details.anonymitySetType,
        chain: chartChain,
      },
    })
  }

  if (hasTrackedAssets) {
    sections.push({
      type: 'PrivacyFlowsSection',
      props: {
        id: 'privacy-flows',
        title: 'Flows',
        subtitle: chainSubtitle,
        defaultRange: defaultChartRange,
        project: chartProject,
        milestones: details.milestones,
        chain: chartChain,
      },
    })

    sections.push({
      type: 'PrivacyAssetsBreakdownSection',
      props: {
        id: 'privacy-assets-breakdown',
        title: 'Assets Breakdown',
        subtitle: chainSubtitle,
        assets: details.assets,
        showTvl: details.hasTvl,
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

  sections.splice(adversariesSectionIndex, 0, {
    type: 'PrivacyAdversariesSection',
    props: {
      id: PRIVACY_ADVERSARIES_SECTION_ID,
      title: 'Privacy',
      isUnderReview: !!details.statuses.reviewStatus,
      adversaries: resolvePrivacySources(details.adversaries, sections),
      referenceApp,
    },
  })

  return {
    id: details.id,
    slug: details.slug,
    href: `/privacy/projects/${details.slug}`,
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
    chain: details.chain,
    chainSubtitle,
    chains: details.chains,
    deployedOn: details.deployedOn,
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
        : details.summary.chainTvl
          ? details.summary.chainTvl.totalValueLockedUsd
          : tvs.projects[details.id]?.breakdown.total,
      totalValueLockedChange7d: !details.hasTvl
        ? undefined
        : details.summary.chainTvl
          ? details.summary.chainTvl.totalValueLockedChange7d
          : tvs.projects[details.id]?.change.total,
      deposits: details.summary.deposits,
      relayerStat: details.summary.relayerStat,
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
