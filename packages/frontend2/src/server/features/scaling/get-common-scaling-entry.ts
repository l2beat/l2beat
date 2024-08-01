import {
  type Layer2Provider,
  type Layer3Provider,
  type Layer2,
  type Layer3,
  type StageConfig,
} from '@l2beat/config'
import { isAnySectionUnderReview } from './utils/is-any-section-under-review'

export function getCommonScalingEntry({
  project,
  isVerified,
  hasImplementationChanged,
}: {
  project: Layer2 | Layer3
  isVerified: boolean
  hasImplementationChanged: boolean
}) {
  const common = {
    id: project.id,
    name: project.display.name,
    href: `/scaling/projects/${project.display.slug}`,
    shortName: project.display.shortName,
    slug: project.display.slug,
    category: project.display.category,
    isVerified,
    hasImplementationChanged,
    isArchived: !!project.isArchived,
    isUpcoming: !!project.isUpcoming,
    isUnderReview: !!project.isUnderReview,
    warning: project.display.warning,
    showProjectUnderReview: isAnySectionUnderReview(project),
    redWarning: project.display.redWarning,
    purposes: project.display.purposes,
  }

  if (project.type === 'layer2') {
    return {
      ...common,
      type: 'layer2' as const,
      provider: project.display.provider,
      stage: project.stage,
      hostChain: undefined,
    }
  }

  return {
    ...common,
    type: 'layer3' as const,
    provider: project.display.provider,
    hostChain: project.hostChain,
    stage: { stage: 'NotApplicable' } satisfies StageConfig,
  }
}

export type CommonScalingEntry = ReturnType<typeof getCommonScalingEntry>
