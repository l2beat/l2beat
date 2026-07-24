import type { ProjectPermissions, ProjectRedWarning } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ProjectLink } from '~/components/projects/links/types'
import type { BadgeWithParams } from '~/components/projects/ProjectBadge'
import type { ExternalDependencyEntry } from '~/components/projects/sections/ExternalDependenciesSection'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { ProjectsChangeReport } from '~/server/features/projects-change-report/getProjectsChangeReport'
import type { SevenDayTvsBreakdown } from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getProjectMetadataDescription } from '~/ssr/head/getProjectMetadataDescription'
import type { RenderData } from '~/ssr/types'
import { getSsrHelpers } from '~/trpc/server'
import type { Manifest } from '~/utils/Manifest'
import { getContractsSection } from '~/utils/project/contracts-and-permissions/getContractsSection'
import { getContractUtils } from '~/utils/project/contracts-and-permissions/getContractUtils'
import { getPermissionsSection } from '~/utils/project/contracts-and-permissions/getPermissionsSection'
import { getBadgeWithParams } from '~/utils/project/getBadgeWithParams'
import { getProjectLinks } from '~/utils/project/getProjectLinks'
import { optionToRange } from '~/utils/range/range'

export interface DefiProjectEntry {
  id: ProjectId
  slug: string
  name: string
  shortName?: string
  icon: string
  description: string
  badges: BadgeWithParams[]
  projectLinks: ProjectLink[]
  discoveryHref?: string
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

/** Counts how many permissions originate from the given reviewed dependency. */
function countDependencyPermissions(
  permissions: Record<string, ProjectPermissions> | 'UnderReview' | undefined,
  dependencyId: ProjectId,
): number {
  if (!permissions || permissions === 'UnderReview') return 0
  let count = 0
  for (const perChain of Object.values(permissions)) {
    for (const permission of [
      ...(perChain.roles ?? []),
      ...(perChain.actors ?? []),
    ]) {
      const matches = permission.permissionOrigins?.some(
        (origin) =>
          origin.type === 'dependency' &&
          (origin.projectId ?? origin.name) === dependencyId,
      )
      if (matches) count++
    }
  }
  return count
}

export async function getDefiProjectData(
  manifest: Manifest,
  slug: string,
  url: string,
): Promise<RenderData | undefined> {
  const helpers = getSsrHelpers()
  const defaultChartRange = optionToRange('1y')
  const [
    appLayoutProps,
    project,
    contractUtils,
    allProjectsWithContracts,
    zkCatalogProjects,
    allProjects,
  ] = await Promise.all([
    getAppLayoutProps(),
    ps.getProject({
      slug,
      select: ['display', 'statuses', 'defiInfo'],
      optional: [
        'contracts',
        'permissions',
        'discoveryInfo',
        'externalDependencies',
        'tvsConfig',
      ],
    }),
    getContractUtils(),
    ps.getProjects({ select: ['contracts'] }),
    ps.getProjects({ select: ['zkCatalogInfo'] }),
    ps.getProjects({}),
  ])

  if (!project) {
    return undefined
  }

  const permissionsSection = getPermissionsSection(
    {
      id: project.id,
      permissions: project.permissions,
      isUnderReview: !!project.statuses.reviewStatus,
    },
    contractUtils,
    EMPTY_PROJECTS_CHANGE_REPORT,
  )

  const contractsSection = getContractsSection(
    {
      id: project.id,
      slug: project.slug,
      contracts: project.contracts,
      isVerified: true,
      isUnderReview: !!project.statuses.reviewStatus,
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
  const icon = manifest.getUrl(`/icons/${project.slug}.png`)
  const discoveryHref =
    contractsSection || permissionsSection ? discoUi.href : undefined
  const hasTvs = project.tvsConfig !== undefined

  if (hasTvs) {
    await helpers.queryClient.prefetchQuery(
      helpers.trpc.privacy.tvlChart.queryOptions({
        projectIds: [project.id],
        range: defaultChartRange,
      }),
    )
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

  if (hasTvs) {
    sections.push({
      type: 'PrivacyTvlSection',
      props: {
        id: 'privacy-tvl',
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

  const externalDependencies = (project.externalDependencies ?? []).flatMap(
    (dependency): ExternalDependencyEntry[] => {
      if (dependency.project) {
        const dependencyProject = allProjects.find(
          (p) => p.id === dependency.project,
        )
        if (!dependencyProject) return []
        return [
          {
            name: dependencyProject.name,
            description: dependency.description,
            icon: manifest.getUrl(`/icons/${dependencyProject.slug}.png`),
            href: `/defi/projects/${dependencyProject.slug}`,
            reviewed: true,
            additionalPermissionsCount: countDependencyPermissions(
              project.permissions,
              dependency.project,
            ),
          },
        ]
      }
      if (!dependency.name || !dependency.icon) return []
      return [
        {
          name: dependency.name,
          description: dependency.description,
          icon: manifest.getUrl(`/icons/${dependency.icon}.png`),
          href: undefined,
          reviewed: false,
        },
      ]
    },
  )
  if (externalDependencies.length > 0) {
    sections.push({
      type: 'ExternalDependenciesSection',
      props: {
        id: 'external-dependencies',
        title: 'External dependencies',
        dependencies: externalDependencies,
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

  const projectEntry: DefiProjectEntry = {
    id: project.id,
    slug: project.slug,
    name: project.name,
    shortName: project.shortName,
    icon,
    description: project.display.description,
    badges: (project.display.badges ?? []).flatMap((badge) => {
      const badgeWithParams = getBadgeWithParams(badge)
      return badgeWithParams ? [badgeWithParams] : []
    }),
    projectLinks: getProjectLinks(project.display.links),
    discoveryHref,
    isUnderReview: !!project.statuses.reviewStatus,
    warnings: {
      yellow: project.statuses.yellowWarning,
      red: project.statuses.redWarning,
      emergency: project.statuses.emergencyWarning,
    },
    sections,
  }

  return {
    head: {
      manifest,
      metadata: getMetadata(manifest, {
        title: `${project.name} - DeFi - L2BEAT`,
        description: getProjectMetadataDescription({
          name: project.name,
          display: {
            description: project.display.description,
          },
        }),
        url,
        openGraph: {
          image: '/meta-images/project-background.png',
        },
      }),
    },
    ssr: {
      page: 'DefiProjectPage',
      props: {
        ...appLayoutProps,
        entry: projectEntry,
        queryState: helpers.dehydrate(),
      },
    },
  }
}
