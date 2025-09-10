import type { Project, ProjectZkCatalogInfo } from '@l2beat/config'
import type { UnixTime } from '@l2beat/shared-pure'
import type { ProjectLink } from '~/components/projects/links/types'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { ps } from '~/server/projects'
import type { SsrHelpers } from '~/trpc/server'
import { getProjectLinks } from '~/utils/project/getProjectLinks'
import {
  getUnderReviewStatus,
  type UnderReviewStatus,
} from '~/utils/project/underReview'
import { getProjectIcon } from '../../utils/getProjectIcon'
import {
  getTrustedSetupsWithVerifiersAndAttesters,
  type TrustedSetupsByProofSystem,
} from '../getTrustedSetupsWithVerifiersAndAttesters'

export interface ProjectZkCatalogEntry {
  name: string
  shortName: string | undefined
  creator?: string
  slug: string
  icon: string
  archivedAt: UnixTime | undefined
  underReviewStatus: UnderReviewStatus
  header: {
    warning?: string
    redWarning?: string
    emergencyWarning?: string
    description?: string
    links: ProjectLink[]
    trustedSetupsByProofSystem: TrustedSetupsByProofSystem
    techStack: ProjectZkCatalogInfo['techStack']
  }
  sections: ProjectDetailsSection[]
}

export async function getZkCatalogProjectEntry(
  project: Project<
    'display' | 'zkCatalogInfo' | 'statuses',
    'archivedAt' | 'milestones'
  >,
  helpers: SsrHelpers,
): Promise<ProjectZkCatalogEntry> {
  const allProjects = await ps.getProjects({
    optional: ['daBridge', 'isBridge', 'isScaling', 'isDaLayer'],
  })

  const trustedSetupsByProofSystem = getTrustedSetupsWithVerifiersAndAttesters(
    project,
    allProjects,
  )

  const header: ProjectZkCatalogEntry['header'] = {
    description: project.display.description,
    warning: project.statuses.yellowWarning,
    redWarning: project.statuses.redWarning,
    emergencyWarning: project.statuses.emergencyWarning,
    links: getProjectLinks(project.display.links),
    trustedSetupsByProofSystem,
    techStack: project.zkCatalogInfo.techStack,
  }

  const common = {
    name: project.name,
    creator: project.zkCatalogInfo.creator,
    shortName: project.shortName,
    slug: project.slug,
    icon: getProjectIcon(project.slug),
    underReviewStatus: getUnderReviewStatus({
      isUnderReview: !!project.statuses.reviewStatus,
      impactfulChange: false,
    }),
    archivedAt: project.archivedAt,
    header,
  }

  const sections: ProjectDetailsSection[] = []

  return { ...common, sections }
}
