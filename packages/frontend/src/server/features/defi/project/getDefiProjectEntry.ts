import type {
  ProjectExternalDependency,
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
import { optionToRange } from '~/utils/range/range'
import { EMPTY_PROJECTS_CHANGE_REPORT } from '../../projects-change-report/getProjectsChangeReport'
import { EMPTY_TVS_BREAKDOWN } from '../../scaling/tvs/get7dTvsBreakdown'
import { resolveDefiDependencies } from '../resolveDefiDependencies'

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

export async function getDefiProjectEntry(
  slug: string,
  helpers: SsrHelpers,
): Promise<ProjectDefiEntry | undefined> {
  const project = await ps.getProject({
    slug,
    where: ['defiInfo'],
    select: ['display', 'statuses'],
    optional: ['contracts', 'permissions', 'tvsConfig', 'externalDependencies'],
  })

  if (!project) {
    return undefined
  }

  const defaultChartRange = optionToRange('1y')
  const icon = manifest.getUrl(`/icons/${project.slug}.png`)
  const [
    contractUtils,
    allProjectsWithContracts,
    zkCatalogProjects,
    dependencyProjects,
  ] = await Promise.all([
    getContractUtils(),
    ps.getProjects({
      select: ['contracts'],
    }),
    ps.getProjects({
      select: ['zkCatalogInfo'],
    }),
    getTrackedDependencyProjects(project.externalDependencies),
    project.tvsConfig !== undefined
      ? helpers.queryClient.prefetchQuery(
          helpers.trpc.defi.tvlChart.queryOptions({
            projectIds: [project.id],
            range: defaultChartRange,
          }),
        )
      : undefined,
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

  if (project.tvsConfig !== undefined) {
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
          new Map(
            dependencyProjects.map((entry) => [
              entry.id,
              {
                name: entry.name,
                slug: entry.slug,
                isDefi: entry.defiInfo !== undefined,
              },
            ]),
          ),
        ),
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
    icon,
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

async function getTrackedDependencyProjects(
  dependencies: ProjectExternalDependency[] | undefined,
) {
  if (!dependencies) {
    return []
  }

  const trackedIds = [
    ...new Set(
      dependencies
        .filter((dependency) => dependency.type === 'tracked')
        .map((dependency) => dependency.projectId),
    ),
  ]

  if (trackedIds.length === 0) {
    return []
  }

  return await ps.getProjects({
    ids: trackedIds,
    optional: ['defiInfo'],
  })
}
