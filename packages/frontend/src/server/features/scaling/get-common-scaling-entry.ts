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
import { type ProjectId } from '@l2beat/shared-pure'
import { env } from 'process'
import {
  type UnderReviewStatus,
  getUnderReviewStatus,
} from '~/utils/project/under-review'
import { getCurrentEntry } from '../utils/get-current-entry'
import { getHostChain } from './utils/get-host-chain'
import { isAnySectionUnderReview } from './utils/is-any-section-under-review'

export interface FilterableScalingValues {
  isRollup: boolean
  type: string
  stack: string
  stage: string
  purposes: string[]
  hostChain: string
  daLayer: string
  raas: string
}

export interface FilterableScalingEntry {
  filterable: FilterableScalingValues | undefined
}

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
  // ---
  tab: 'Rollups' | 'ValidiumsAndOptimiums' | 'Others'
  /** 0 - n/a, 1 - stage0, 2 - stage1&2, 3 - ethereum */
  stageOrder: number
  filterable: FilterableScalingValues | undefined
}

interface Params {
  project: Layer2 | Layer3
  isVerified: boolean
  hasImplementationChanged: boolean
  hasHighSeverityFieldChanged: boolean
}

export function getCommonScalingEntry({
  project,
  isVerified,
  hasImplementationChanged,
  hasHighSeverityFieldChanged,
}: Params): CommonScalingEntry {
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
      hasImplementationChanged,
      hasHighSeverityFieldChanged,
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
    // ---
    tab:
      env.NEXT_PUBLIC_FEATURE_FLAG_OTHER_PROJECTS && project.display.isOther
        ? 'Others'
        : project.display.category.includes('Rollup')
          ? 'Rollups'
          : 'ValidiumsAndOptimiums',
    stageOrder: getStageOrder(project.stage),
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

function getStageOrder(stage: StageConfig | undefined): number {
  if (stage?.stage === 'Stage 2' || stage?.stage === 'Stage 1') {
    return 2
  }
  if (stage?.stage === 'Stage 0') {
    return 1
  }
  return 0
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
