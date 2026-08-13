import type { ProjectRedWarning } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import type { ProjectLink } from '~/components/projects/links/types'
import type { BadgeWithParams } from '~/components/projects/ProjectBadge'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import { getContractsSection } from '~/utils/project/contracts-and-permissions/getContractsSection'
import { getContractUtils } from '~/utils/project/contracts-and-permissions/getContractUtils'
import { getPermissionsSection } from '~/utils/project/contracts-and-permissions/getPermissionsSection'
import { getBadgeWithParams } from '~/utils/project/getBadgeWithParams'
import { getProjectLinks } from '~/utils/project/getProjectLinks'
import type { ProjectsChangeReport } from '../../projects-change-report/getProjectsChangeReport'
import type { SevenDayTvsBreakdown } from '../../scaling/tvs/get7dTvsBreakdown'

export interface ProjectDefiEntry {
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

export async function getDefiProjectEntry(
  slug: string,
): Promise<ProjectDefiEntry | undefined> {
  const project = await ps.getProject({
    slug,
    where: ['defiInfo'],
    select: ['display', 'statuses'],
    optional: ['contracts', 'permissions', 'tvsConfig'],
  })

  if (!project) {
    return undefined
  }

  const [contractUtils, allProjectsWithContracts, zkCatalogProjects] =
    await Promise.all([
      getContractUtils(),
      ps.getProjects({
        select: ['contracts'],
      }),
      ps.getProjects({
        select: ['zkCatalogInfo'],
      }),
    ])

  const isUnderReview = !!project.statuses.reviewStatus
  const permissionsSection = getPermissionsSection(
    {
      id: project.id,
      permissions: project.permissions,
      isUnderReview,
    },
    contractUtils,
    EMPTY_PROJECTS_CHANGE_REPORT,
  )

  const contractsSection = getContractsSection(
    {
      id: project.id,
      slug: project.slug,
      contracts: project.contracts,
      tvsConfig: project.tvsConfig,
      isVerified: project.statuses.unverifiedContracts.length === 0,
      isUnderReview,
    },
    contractUtils,
    EMPTY_PROJECTS_CHANGE_REPORT,
    zkCatalogProjects,
    allProjectsWithContracts,
    EMPTY_TVS_BREAKDOWN,
  )

  const discoUi = {
    href: `https://disco.l2beat.com/ui/p/${project.id}`,
    images: {
      desktop: manifest.getUrl('/images/disco-ui-desktop.png'),
      mobile: manifest.getUrl('/images/disco-ui-mobile.png'),
    },
  }

  const sections: ProjectDetailsSection[] = []

  if (project.display.detailedDescription) {
    sections.push({
      type: 'DetailedDescriptionSection',
      props: {
        id: 'detailed-description',
        title: 'Protocol description',
        description: undefined,
        detailedDescription: project.display.detailedDescription,
        references: project.display.references,
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
    id: project.id,
    slug: project.slug,
    name: project.name,
    shortName: project.shortName,
    icon: manifest.getUrl(`/icons/${project.slug}.png`),
    description: project.display.description,
    badges: project.display.badges.flatMap((badge) => {
      const badgeWithParams = getBadgeWithParams(badge)
      return badgeWithParams ? [badgeWithParams] : []
    }),
    projectLinks: getProjectLinks(project.display.links),
    discoveryHref:
      contractsSection || permissionsSection ? discoUi.href : undefined,
    discoUi,
    isUnderReview,
    warnings: {
      yellow: project.statuses.yellowWarning,
      red: project.statuses.redWarning,
      emergency: project.statuses.emergencyWarning,
    },
    sections,
  }
}
