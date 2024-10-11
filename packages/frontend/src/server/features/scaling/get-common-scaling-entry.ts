import {
  type Layer2,
  type Layer3,
  type StageConfig,
  badges,
} from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { type SetOptional } from 'type-fest'
import { getHostChain } from './utils/get-host-chain'
import { isAnySectionUnderReview } from './utils/is-any-section-under-review'

// Optional type and category is needed to support Ethereum L1 entry
export type CommonScalingEntry = SetOptional<
  ReturnType<typeof getCommonScalingEntry>,
  'type' | 'category' | 'purposes' | 'stateValidation'
>

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
      headerWarning: undefined,
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
      badges: [],
      stateValidation: undefined,
    }
  }

  const { project, isVerified, hasImplementationChanged } = params

  return {
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
    badges:
      project.badges?.map((badge) => ({
        badge,
        kind: badges[badge].type,
      })) ?? [],
    type: project.type,
    provider: project.display.provider,
    hostChain: getHostChain(project),
    stage:
      project.type === 'layer2'
        ? project.stage
        : ({ stage: 'NotApplicable' } satisfies StageConfig),
    stateValidation: project.riskView.stateValidation,
  }
}
