import {
  type BadgeId,
  type BadgeType,
  type Layer2,
  type Layer2Provider,
  type Layer3,
  type ScalingProjectCategory,
  type ScalingProjectPurpose,
  type StageConfig,
  badges,
} from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import {
  type UnderReviewStatus,
  getUnderReviewStatus,
} from '~/utils/project/under-review'
import { getCurrentEntry } from '../utils/get-current-entry'
import { getHostChain } from './utils/get-host-chain'
import { isAnySectionUnderReview } from './utils/is-any-section-under-review'

export interface CommonScalingEntry {
  id: ProjectId
  name: string
  shortName: string | undefined
  slug: string
  href: string | undefined
  category: ScalingProjectCategory | undefined
  isOther: boolean | undefined
  isVerified: boolean
  underReviewStatus: UnderReviewStatus
  isArchived: boolean
  isUpcoming: boolean
  warning: string | undefined
  headerWarning: string | undefined
  redWarning: string | undefined
  purposes: ScalingProjectPurpose[]
  badges: { badge: BadgeId; kind: BadgeType }[]
  type: 'layer2' | 'layer3' | undefined
  provider: Layer2Provider | undefined
  hostChain: string | undefined
  stage: StageConfig
  filterable:
    | {
        isRollup: boolean
        type: string
        stack: string
        stage: string
        purposes: string[]
        hostChain: string
        daLayer: string
        raas: string
      }
    | undefined
}

interface Params {
  project: Layer2 | Layer3
  isVerified: boolean
  hasImplementationChanged: boolean
  hasHighSeverityFieldChanged: boolean
}

export function getCommonScalingEntry(
  params: Params | { project: 'ethereum' },
): CommonScalingEntry {
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
      filterable: undefined,
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
    isOther: !!project.display.isOther,
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
    hostChain: project.type === 'layer2' ? undefined : getHostChain(project),
    stage: project.stage ?? ({ stage: 'NotApplicable' } satisfies StageConfig),
    filterable: {
      isRollup: project.display.category.includes('Rollup'),
      type: project.display.category,
      stack: project.display.provider ?? 'No stack',
      stage: getStage(project.stage),
      purposes: project.display.purposes,
      hostChain: project.type === 'layer2' ? 'Ethereum' : getHostChain(project),
      daLayer:
        getCurrentEntry(project.dataAvailability)?.layer.value ?? 'Unknown',
      raas: getRaas(project.badges ?? []),
    },
  }
}

function getStage(config: StageConfig | undefined) {
  if (!config || config.stage === 'NotApplicable') {
    return 'Not applicable'
  }
  if (config.stage === 'UnderReview') {
    return 'Under review'
  }
  return config.stage
}

function getRaas(projectBadges: BadgeId[]) {
  const badge = projectBadges.find((id) => badges[id].type === 'RaaS')
  if (!badge) {
    return 'No RaaS'
  }
  return badges[badge].display.name
}
