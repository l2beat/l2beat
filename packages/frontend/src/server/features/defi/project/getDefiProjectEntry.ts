import type { ProjectDefiCategory, ProjectRedWarning } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import type { ProjectLink } from '~/components/projects/links/types'
import type { BadgeWithParams } from '~/components/projects/ProjectBadge'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { env } from '~/env'
import { getUpdatesSection } from '~/server/features/projects/discovery-updates/getUpdatesSection'
import { getProjectOssification } from '~/server/features/projects/ossification/getProjectOssification'
import { ps } from '~/server/projects'
import type { SsrHelpers } from '~/trpc/server'
import { manifest } from '~/utils/Manifest'
import { getContractsSection } from '~/utils/project/contracts-and-permissions/getContractsSection'
import { getContractUtils } from '~/utils/project/contracts-and-permissions/getContractUtils'
import { getPermissionsSection } from '~/utils/project/contracts-and-permissions/getPermissionsSection'
import { getBadgeWithParams } from '~/utils/project/getBadgeWithParams'
import { getProjectLinks } from '~/utils/project/getProjectLinks'
import { optionToRange } from '~/utils/range/range'
import { EMPTY_TVS_BREAKDOWN } from '../../layer2s/tvs/get7dTvsBreakdown'
import { getProjectsChangeReport } from '../../projects-change-report/getProjectsChangeReport'
import { getDefiTvlDataSource } from '../getDefiTvlDataSource'
import {
  getDefiDependencyProjectsById,
  resolveDefiDependencies,
} from '../resolveDefiDependencies'

export interface ProjectDefiEntry {
  id: ProjectId
  slug: string
  name: string
  shortName?: string
  icon: string
  description: string
  category?: ProjectDefiCategory
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

export async function getDefiProjectEntry(
  slug: string,
  helpers: SsrHelpers,
): Promise<ProjectDefiEntry | undefined> {
  const project = await ps.getProject({
    slug,
    select: ['display', 'statuses', 'defiInfo'],
    optional: [
      'contracts',
      'permissions',
      'tvsConfig',
      'externalDependencies',
      'discoveryUpdates',
      'ossificationHistory',
    ],
  })

  if (!project) {
    return undefined
  }

  const defaultChartRange = optionToRange('1y')
  const icon = manifest.getUrl(`/icons/${project.slug}.png`)
  const [
    contractUtils,
    projectsChangeReport,
    dependencyProjectsById,
    ossification,
  ] = await Promise.all([
    getContractUtils(),
    getProjectsChangeReport(),
    getDefiDependencyProjectsById(project.externalDependencies),
    getProjectOssification(project),
  ])
  // DeFi pages get the Updates section together with ossification.
  const discoveryUpdates = env.CLIENT_SIDE_OSSIFICATION_ENABLED
    ? (project.discoveryUpdates ?? [])
    : []

  const isUnderReview = !!project.statuses.reviewStatus
  const permissionsSection = getPermissionsSection(
    {
      id: project.id,
      permissions: project.permissions,
      isUnderReview,
    },
    contractUtils,
    projectsChangeReport,
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
    projectsChangeReport,
    [],
    [],
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

  if (
    project.display.detailedDescription ||
    (project.display.references && project.display.references.length > 0)
  ) {
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

  if (project.defiInfo.tvl !== undefined) {
    sections.push({
      type: 'DefiTvlSection',
      props: {
        id: 'tvs',
        title: 'Value Locked',
        defaultRange: defaultChartRange,
        project: {
          id: project.id,
          name: project.name,
          shortName: project.shortName,
          iconUrl: icon,
        },
        dataSource: getDefiTvlDataSource(project.defiInfo.tvl),
      },
    })
  }

  if (project.externalDependencies !== undefined) {
    sections.push({
      type: 'ExternalDependenciesSection',
      props: {
        id: 'external-dependencies',
        title: 'External dependencies',
        dependencies: resolveDefiDependencies(
          project.externalDependencies,
          dependencyProjectsById,
        ),
      },
    })
  }

  const updatesSection = await getUpdatesSection(
    helpers,
    project.id,
    discoveryUpdates,
    ossification,
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
    id: project.id,
    slug: project.slug,
    name: project.name,
    shortName: project.shortName,
    icon,
    description: project.display.description,
    category: project.defiInfo.category,
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
