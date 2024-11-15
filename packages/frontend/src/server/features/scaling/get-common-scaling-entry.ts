import {
  type Layer2,
  type Layer3,
  type StageConfig,
  badges,
} from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { type SetOptional } from 'type-fest'
import { getUnderReviewStatus } from '~/utils/project/under-review'
import { getHostChain } from './utils/get-host-chain'
import { isAnySectionUnderReview } from './utils/is-any-section-under-review'

// Optional type and category is needed to support Ethereum L1 entry
export type CommonScalingEntry = SetOptional<
  ReturnType<typeof getCommonScalingEntry>,
  'type' | 'category' | 'purposes'
>

interface Params {
  project: Layer2 | Layer3
  isVerified: boolean
  hasImplementationChanged: boolean
  hasHighSeverityFieldChanged: boolean
}

export function getCommonScalingEntry(
  params: Params | { project: 'ethereum' },
) {
  if (params.project === 'ethereum') {
    return {
      id: ProjectId.ETHEREUM,
      name: 'Ethereum',
      shortName: undefined,
      slug: 'ethereum',
      type: undefined,
      category: undefined,
      isOther: undefined,
      provider: undefined,
      purposes: [],
      warning: undefined,
      headerWarning: undefined,
      redWarning: undefined,
      isVerified: true,
      isArchived: false,
      hostChain: undefined,
      href: undefined,
      isUpcoming: false,
      underReviewStatus: undefined,
      stage: { stage: 'NotApplicable' as const },
      badges: [],
    }
  }

  const { project, isVerified } = params

  return {
    id: project.id,
    name: project.display.name,
    href: `/scaling/projects/${project.display.slug}`,
    shortName: project.display.shortName,
    slug: project.display.slug,
    category: project.display.category,
    isOther: project.display.isOther,
    isVerified,
    underReviewStatus: getUnderReviewStatus({
      isUnderReview: isAnySectionUnderReview(project),
      hasImplementationChanged: params.hasImplementationChanged,
      hasHighSeverityFieldChanged: params.hasHighSeverityFieldChanged,
    }),
    isArchived: !!project.isArchived,
    isUpcoming: !!project.isUpcoming,
    warning: project.display.warning,
    headerWarning: project.display.headerWarning,
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
    stage: project.stage ?? ({ stage: 'NotApplicable' } satisfies StageConfig),
  }
}
