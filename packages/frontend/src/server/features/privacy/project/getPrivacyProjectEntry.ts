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
import { getGardenCropsSection } from '~/server/features/garden/getGardenCropsSection'
import { getUpdatesSection } from '~/server/features/projects/discovery-updates/getUpdatesSection'
import { countRecentDiscoveryUpdates } from '~/server/features/projects/recent-changes/discoveryUpdates'
import type { SsrHelpers } from '~/trpc/server'
import { manifest } from '~/utils/Manifest'
import { getContractsSection } from '~/utils/project/contracts-and-permissions/getContractsSection'
import { getContractUtils } from '~/utils/project/contracts-and-permissions/getContractUtils'
import { getPermissionsSection } from '~/utils/project/contracts-and-permissions/getPermissionsSection'
import { getBadgeWithParams } from '~/utils/project/getBadgeWithParams'
import { getProjectLinks } from '~/utils/project/getProjectLinks'
import { getProjectPath } from '~/utils/project/getProjectPath'
import { optionToRange } from '~/utils/range/range'
import {
  EMPTY_TVS_BREAKDOWN,
  get7dTvsBreakdown,
} from '../../layer2s/tvs/get7dTvsBreakdown'
import { EMPTY_PROJECTS_CHANGE_REPORT } from '../../projects-change-report/getProjectsChangeReport'
import type { PrivacyProjectDetails } from '../getPrivacyProjectDetails'
import type { PrivacyRelayerStat } from '../types'
import type { PrivacyReferenceApp } from '../utils/getPrivacyReferenceApp'
import {
  getPrivacyTrustedSetup,
  type PrivacyTrustedSetupSummary,
  toTrustedSetupSummaryValue,
} from '../utils/getPrivacyTrustedSetup'
import {
  getChartProject,
  getPrivacyAdversariesSection,
  getPrivacyAdviceSection,
  getPrivacyAnonymitySetSection,
  getPrivacyAssetsBreakdownSection,
  getPrivacyDescriptionSection,
  getPrivacyFlowsSection,
  getPrivacyTrustedSetupsSection,
  getReferenceApp,
  linkPrivacySources,
} from './privacySections'

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

/**
 * What the summary of a page built on another section shows of a privacy
 * protocol.
 */
export type PrivacySummary = Pick<
  ProjectPrivacyEntry,
  | 'name'
  | 'href'
  | 'isUnderReview'
  | 'attributes'
  | 'trackedOn'
  | 'scalingProjects'
  | 'referenceApp'
>

export function getPrivacySummary(
  details: PrivacyProjectDetails,
): PrivacySummary {
  return {
    name: details.name,
    href: getProjectPath(details.slug),
    isUnderReview: !!details.statuses.reviewStatus,
    attributes: details.attributes,
    trackedOn: details.trackedOn,
    scalingProjects: details.scalingProjects,
    referenceApp: getReferenceApp(details),
  }
}

export async function getPrivacyProjectEntry(
  details: PrivacyProjectDetails,
  helpers: SsrHelpers,
): Promise<ProjectPrivacyEntry> {
  const [contractUtils, tvs] = await Promise.all([
    getContractUtils(),
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
  const discoveryHref =
    contractsSection || permissionsSection ? discoUi.href : undefined
  const discoveryUpdates = details.discoveryUpdates ?? []

  const sections: ProjectDetailsSection[] = []
  const push = (section: ProjectDetailsSection | undefined) => {
    if (section) sections.push(section)
  }

  const gardenCropsSection = await getGardenCropsSection(
    details,
    details.ossification,
  )
  if (gardenCropsSection) {
    sections.push(gardenCropsSection)
  }

  push(getPrivacyDescriptionSection(details))
  push(getPrivacyAdversariesSection(details))
  push(getPrivacyAdviceSection(details))

  if (details.hasTvl) {
    sections.push({
      type: 'TvsValueSection',
      props: {
        id: 'privacy-tvl',
        title: 'Value Locked',
        defaultRange: optionToRange('1y'),
        rangeControls: 'privacy',
        project: getChartProject(details),
        milestones: details.milestones,
      },
    })
  }

  push(getPrivacyAnonymitySetSection(details))
  push(getPrivacyFlowsSection(details))
  push(getPrivacyAssetsBreakdownSection(details))

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

  push(getPrivacyTrustedSetupsSection(details))

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

  return {
    ...getPrivacySummary(details),
    id: details.id,
    slug: details.slug,
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
    exitWindow: details.exitWindow,
    trustedSetup: toTrustedSetupSummaryValue(
      getPrivacyTrustedSetup(details.trustedSetups),
    ),
    reproducibility: details.reproducibility,
    summary: {
      totalValueLockedUsd: details.hasTvl
        ? tvs.projects[details.id]?.breakdown.total
        : undefined,
      totalValueLockedChange7d: details.hasTvl
        ? tvs.projects[details.id]?.change.total
        : undefined,
      deposits: details.summary.deposits,
      relayerStat: details.summary.relayerStat,
    },
    archivedAt: details.archivedAt,
    recentUpdatesCount: countRecentDiscoveryUpdates(discoveryUpdates),
    warnings: {
      yellow: details.statuses.yellowWarning,
      red: details.statuses.redWarning,
      emergency: details.statuses.emergencyWarning,
    },
    sections: linkPrivacySources(sections, details),
  }
}
