import {
  type BadgeId,
  type Layer2,
  type Layer3,
  type StageConfig,
  badges,
  getProjectsVerificationStatuses,
} from '@l2beat/config'
import { env } from '~/env'
import { type SyncStatus } from '~/types/sync-status'
import { formatTimestamp } from '~/utils/dates'
import { getUnderReviewStatus } from '~/utils/project/under-review'
import { type ProjectChanges } from '../projects-change-report/get-projects-change-report'
import { type CommonProjectEntry } from '../utils/get-common-project-entry'
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
  tab: 'Rollups' | 'ValidiumsAndOptimiums' | 'Others'
  /** 0 - n/a, 1 - stage0, 2 - stage1&2, 3 - ethereum */
  stageOrder: number
  filterable: FilterableScalingValues | undefined
}

interface Params {
  project: Layer2 | Layer3
  changes: ProjectChanges | undefined
  syncStatus: SyncStatus | undefined
}

export function getCommonScalingEntry({
  project,
  changes,
  syncStatus,
}: Params): CommonScalingEntry {
  return {
    id: project.id,
    slug: project.display.slug,
    name: project.display.name,
    nameSecondLine:
      project.type === 'layer2' ? undefined : `L3 on ${getHostChain(project)}`,
    shortName: project.display.shortName,
    href: `/scaling/projects/${project.display.slug}`,
    statuses: {
      yellowWarning: project.display.headerWarning,
      redWarning: project.display.redWarning,
      verificationWarning: !getProjectsVerificationStatuses(project),
      underReview: getUnderReviewStatus({
        isUnderReview: isAnySectionUnderReview(project),
        highSeverityFieldChanged: !!changes?.highSeverityFieldChanged,
        implementationChanged: !!changes?.implementationChanged,
      }),
      syncStatusInfo:
        syncStatus?.isSynced === false
          ? `The data for this item is not synced since ${formatTimestamp(
              syncStatus.syncedUntil,
              {
                mode: 'datetime',
                longMonthName: true,
              },
            )}.`
          : undefined,
    },
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

export function getStage(config: StageConfig | undefined) {
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
