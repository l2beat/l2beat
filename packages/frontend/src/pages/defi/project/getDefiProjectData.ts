import type { ProjectRedWarning } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { getAppLayoutProps } from '~/common/getAppLayoutProps'
import type { ProjectLink } from '~/components/projects/links/types'
import type { BadgeWithParams } from '~/components/projects/ProjectBadge'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { ProjectsChangeReport } from '~/server/features/projects-change-report/getProjectsChangeReport'
import type { SevenDayTvsBreakdown } from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import { ps } from '~/server/projects'
import { getMetadata } from '~/ssr/head/getMetadata'
import { getProjectMetadataDescription } from '~/ssr/head/getProjectMetadataDescription'
import type { RenderData } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getContractsSection } from '~/utils/project/contracts-and-permissions/getContractsSection'
import { getContractUtils } from '~/utils/project/contracts-and-permissions/getContractUtils'
import { getPermissionsSection } from '~/utils/project/contracts-and-permissions/getPermissionsSection'
import { getBadgeWithParams } from '~/utils/project/getBadgeWithParams'
import { getProjectLinks } from '~/utils/project/getProjectLinks'

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

export async function getDefiProjectData(
  manifest: Manifest,
  slug: string,
  url: string,
): Promise<RenderData | undefined> {
  const [
    appLayoutProps,
    project,
    contractUtils,
    allProjectsWithContracts,
    zkCatalogProjects,
  ] = await Promise.all([
    getAppLayoutProps(),
    ps.getProject({
      slug,
      select: ['display', 'statuses', 'defiInfo'],
      optional: ['contracts', 'permissions', 'discoveryInfo'],
    }),
    getContractUtils(),
    ps.getProjects({ select: ['contracts'] }),
    ps.getProjects({ select: ['zkCatalogInfo'] }),
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
      },
    },
  }
}
