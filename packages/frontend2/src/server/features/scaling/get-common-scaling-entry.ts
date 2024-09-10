import {
  type Layer2,
  type Layer3,
  type StageConfig,
  layer2s,
} from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { type SetOptional } from 'type-fest'
import { isAnySectionUnderReview } from './utils/is-any-section-under-review'

export function getCommonScalingEntry(
  params:
    | {
        project: Layer2 | Layer3
        isVerified: boolean
        hasImplementationChanged: boolean
      }
    | { project: 'ethereum' },
) {
  if (params.project === 'ethereum') {
    return {
      id: ProjectId.ETHEREUM,
      name: 'Ethereum',
      shortName: undefined,
      slug: 'ethereum',
      type: undefined,
      category: undefined,
      provider: undefined,
      purposes: [],
      warning: undefined,
      redWarning: undefined,
      isVerified: true,
      showProjectUnderReview: false,
      isArchived: false,
      hostChain: undefined,
      href: undefined,
      hasImplementationChanged: false,
      isUpcoming: false,
      isUnderReview: false,
      stage: { stage: 'NotApplicable' as const },
    }
  }

  const { project, isVerified, hasImplementationChanged } = params

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
    headerWarning: project.display.headerWarning,
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
    hostChain:
      project.hostChain === 'Multiple'
        ? 'Multiple'
        : layer2s.find((l) => l.id === project.hostChain)?.display.name,
    stage: { stage: 'NotApplicable' } satisfies StageConfig,
  }
}

// Optional type and category is needed to support Ethereum L1 entry
export type CommonScalingEntry = SetOptional<
  ReturnType<typeof getCommonScalingEntry>,
  'type' | 'category'
>
