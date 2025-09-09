import type { Project } from '@l2beat/config'
import type { UnixTime } from '@l2beat/shared-pure'
import type { ProjectLink } from '~/components/projects/links/types'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { SsrHelpers } from '~/trpc/server'
import { getProjectLinks } from '~/utils/project/getProjectLinks'
import {
  getUnderReviewStatus,
  type UnderReviewStatus,
} from '~/utils/project/underReview'
import { getProjectIcon } from '../utils/getProjectIcon'

export interface ProjectZkCatalogEntry {
  name: string
  shortName: string | undefined
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
  const header: ProjectZkCatalogEntry['header'] = {
    description: project.display.description,
    warning: project.statuses.yellowWarning,
    redWarning: project.statuses.redWarning,
    emergencyWarning: project.statuses.emergencyWarning,
    links: getProjectLinks(project.display.links),
  }

  const common = {
    name: project.name,
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

  await Promise.resolve()

  return { ...common, sections }
}
