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
import {
  type UnderReviewStatus,
  getUnderReviewStatus,
  getUnderReviewText,
} from '~/utils/project/under-review'
import { getCurrentEntry } from '../utils/get-current-entry'
import { getHostChain } from './utils/get-host-chain'
import { isAnySectionUnderReview } from './utils/is-any-section-under-review'
import { CommonProjectEntry } from '~/types/common-project-entry'

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
  // TODO: not undefined?
  filterable: FilterableScalingValues | undefined

  name: string
  shortName: string | undefined
  slug: string
  href: string
  category: ScalingProjectCategory
  isOther: boolean
  isVerified: boolean
  underReviewStatus: UnderReviewStatus
  isArchived: boolean
  isUpcoming: boolean
  warning: string | undefined
  headerWarning: string | undefined
  redWarning: string | undefined
  purposes: ScalingProjectPurpose[]
  badges: { badge: BadgeId; kind: BadgeType }[]
  type: 'layer2' | 'layer3'
  provider: Layer2Provider | undefined
  hostChain: string | undefined
  stage: StageConfig
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
