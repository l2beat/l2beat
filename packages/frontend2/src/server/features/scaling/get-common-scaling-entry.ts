import { type Layer3, type Layer2 } from '@l2beat/config'
import { isAnySectionUnderReview } from './utils/is-any-section-under-review'

export function getCommonScalingEntry<T extends Layer2 | Layer3>({
  project,
  isVerified,
  hasImplementationChanged,
}: {
  project: T
  isVerified: boolean
  hasImplementationChanged: boolean
}) {
  return {
    name: project.display.name,
    href: `/scaling/projects/${project.display.slug}`,
    shortName: project.display.shortName,
    slug: project.display.slug,
    category: project.display.category,
    type: project.type as T['type'],
    provider: project.display.provider as T['display']['provider'],
    warning: project.display.warning,
    isVerified,
    hasImplementationChanged,
    showProjectUnderReview: isAnySectionUnderReview(project),
    redWarning: project.display.redWarning,
    purposes: project.display.purposes,
    stage: (project.type === 'layer2'
      ? project.stage
      : undefined) as T extends Layer2 ? Layer2['stage'] : undefined,
    isArchived: !!project.isArchived,
    isUpcoming: !!project.isUpcoming,
    isUnderReview: !!project.isUnderReview,
  }
}
