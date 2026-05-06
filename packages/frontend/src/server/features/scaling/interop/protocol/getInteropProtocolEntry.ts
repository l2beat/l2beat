import type { Project, ProjectRedWarning } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import type { ProjectLink } from '~/components/projects/links/types'
import type { BadgeWithParams } from '~/components/projects/ProjectBadge'
import { getProjectsChangeReport } from '~/server/features/projects-change-report/getProjectsChangeReport'
import { get7dTvsBreakdown } from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import {
  type ContractsSection,
  getContractsSection,
} from '~/utils/project/contracts-and-permissions/getContractsSection'
import { getContractUtils } from '~/utils/project/contracts-and-permissions/getContractUtils'
import {
  getPermissionsSection,
  type PermissionSection,
} from '~/utils/project/contracts-and-permissions/getPermissionsSection'
import { getProjectLinks } from '~/utils/project/getProjectLinks'
import {
  getUnderReviewStatus,
  type UnderReviewStatus,
} from '~/utils/project/underReview'

export interface InteropProtocolEntry {
  id: ProjectId
  name: string
  shortName: string | undefined
  slug: string
  icon: string
  underReviewStatus: UnderReviewStatus
  header: {
    warning?: string
    redWarning?: ProjectRedWarning
    emergencyWarning?: string
    description?: string
    detailedDescription?: string
    badges?: BadgeWithParams[]
    links?: ProjectLink[]
    hostChain?: string
  }
  permissionsSection: PermissionSection | undefined
  contractsSection: ContractsSection | undefined
}

export async function getInteropProtocolEntry(
  project: Project<'interopConfig', 'display' | 'statuses'>,
): Promise<InteropProtocolEntry> {
  const isUnderReview = !!project.statuses?.reviewStatus
  const [
    contractUtils,
    projectsChangeReport,
    zkCatalogProjects,
    allProjectsWithContracts,
    tvsStats,
  ] = await Promise.all([
    getContractUtils(),
    getProjectsChangeReport(),
    ps.getProjects({ select: ['zkCatalogInfo'] }),
    ps.getProjects({ select: ['contracts'] }),
    get7dTvsBreakdown({ type: 'layer2' }),
  ])

  const permissionsSection = getPermissionsSection(
    {
      id: project.id,
      isUnderReview,
      permissions: project.interopConfig.permissions,
    },
    contractUtils,
    projectsChangeReport,
  )

  const contractsSection = getContractsSection(
    {
      id: project.id,
      slug: project.slug,
      isUnderReview,
      isVerified: true,
      contracts: project.interopConfig.contracts,
    },
    contractUtils,
    projectsChangeReport,
    zkCatalogProjects,
    allProjectsWithContracts,
    tvsStats,
  )

  return {
    id: project.id,
    name: project.interopConfig?.name ?? project.name,
    shortName: project.shortName,
    slug: project.slug,
    icon: manifest.getUrl(`/icons/${project.slug}.png`),
    underReviewStatus: getUnderReviewStatus({
      isUnderReview,
      impactfulChange: false,
    }),
    header: {
      description: project.interopConfig.description,
      detailedDescription: project.interopConfig.detailedDescription,
      warning: project.statuses?.yellowWarning,
      redWarning: project.statuses?.redWarning,
      emergencyWarning: project.statuses?.emergencyWarning,
      links: project.display?.links
        ? getProjectLinks(project.display.links)
        : undefined,
    },
    permissionsSection,
    contractsSection,
  }
}
