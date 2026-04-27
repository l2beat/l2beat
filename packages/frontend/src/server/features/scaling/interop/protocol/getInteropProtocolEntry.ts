import type { Project, ProjectRedWarning } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import type { ProjectLink } from '~/components/projects/links/types'
import type { BadgeWithParams } from '~/components/projects/ProjectBadge'
import { manifest } from '~/utils/Manifest'
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
    badges?: BadgeWithParams[]
    links?: ProjectLink[]
    hostChain?: string
  }
}

export function getInteropProtocolEntry(
  project: Project<'interopConfig', 'display' | 'statuses'>,
): InteropProtocolEntry {
  return {
    id: project.id,
    name: project.interopConfig?.name ?? project.name,
    shortName: project.shortName,
    slug: project.slug,
    icon: manifest.getUrl(`/icons/${project.slug}.png`),
    underReviewStatus: getUnderReviewStatus({
      isUnderReview: !!project.statuses?.reviewStatus,
      impactfulChange: false,
    }),
    header: {
      description: project.display?.description,
      warning: project.statuses?.yellowWarning,
      redWarning: project.statuses?.redWarning,
      emergencyWarning: project.statuses?.emergencyWarning,
      links: project.display?.links
        ? getProjectLinks(project.display.links)
        : undefined,
    },
  }
}
