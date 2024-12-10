import {
  type BadgeId,
  type Layer2,
  type Layer3,
  type StageConfig,
  badges,
} from '@l2beat/config'
import { CommonProjectEntry } from '~/types/common-project-entry'
import {
  getUnderReviewStatus,
  getUnderReviewText,
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

export interface CommonScalingEntry extends CommonProjectEntry {
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
    basicInfo: {
      name: project.display.name,
      shortName: project.display.shortName,
      nameLine2:
        project.type === 'layer3'
          ? `L3 on ${getHostChain(project)}`
          : undefined,
      slug: project.display.slug,
      href: `/scaling/projects/${project.display.slug}`,
    },
    statuses: {
      yellowWarning: project.display.headerWarning,
      redWarning: project.display.redWarning,
      verificationWarning: !isVerified
        ? 'This project contains unverified contracts.'
        : undefined,
      // TODO: add sync status info
      syncStatusInfo: undefined,
      underReviewInfo: getUnderReviewInfo({
        project,
        hasHighSeverityFieldChanged,
        hasImplementationChanged,
      }),
    },
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

function getStage(config: StageConfig | undefined) {
  if (!config || config.stage === 'NotApplicable') {
    return 'Not applicable'
  }
  if (config.stage === 'UnderReview') {
    return 'Under review'
  }
  return config.stage
}

function getStageOrder(config: StageConfig | undefined): number {
  if (!config) {
    return -1
  }
  const order: Record<StageConfig['stage'], number> = {
    NotApplicable: -1,
    UnderReview: -1,
    'Stage 0': 0,
    'Stage 1': 1,
    'Stage 2': 2,
  }
  return order[config.stage]
}

export function getRaas(projectBadges: BadgeId[]) {
  const badge = projectBadges.find((id) => badges[id].type === 'RaaS')
  if (!badge) {
    return 'No RaaS'
  }
  return badges[badge].display.name
}

function getUnderReviewInfo(options: {
  project: Layer2 | Layer3
  hasImplementationChanged: boolean
  hasHighSeverityFieldChanged: boolean
}) {
  const status = getUnderReviewStatus({
    isUnderReview: isAnySectionUnderReview(options.project),
    hasImplementationChanged: options.hasImplementationChanged,
    hasHighSeverityFieldChanged: options.hasHighSeverityFieldChanged,
  })
  if (status !== undefined) {
    return getUnderReviewText(status)
  }
}
