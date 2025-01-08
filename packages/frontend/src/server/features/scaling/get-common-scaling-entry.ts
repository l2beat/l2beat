import {
  type BadgeId,
  type Layer2,
  type Layer3,
  type ProjectWith,
  type StageConfig,
  badges,
  getCurrentEntry,
  isUnderReview,
  isVerified,
} from '@l2beat/config'
import { type ActivityChartType } from '~/components/chart/activity/use-activity-chart-render-params'
import { type SyncStatus } from '~/types/sync-status'
import { formatTimestamp } from '~/utils/dates'
import { getUnderReviewStatus } from '~/utils/project/under-review'
import { type ProjectChanges } from '../projects-change-report/get-projects-change-report'
import { type CommonProjectEntry } from '../utils/get-common-project-entry'
import { getCountdowns } from './utils/get-countdowns'
import { getHostChain } from './utils/get-host-chain'
import { isProjectOther } from './utils/is-project-other'

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
  tab: ActivityChartType
  /** 0 - n/a, 1 - stage0, 2 - stage1&2, 3 - ethereum */
  stageOrder: number
  filterable: FilterableScalingValues | undefined
}

interface Params {
  project: Layer2 | Layer3
  changes: ProjectChanges | undefined
  syncStatus: SyncStatus | undefined
}

// TODO: Once this is the only version being used remove the 2 and the old one
export function getCommonScalingEntry2({
  project,
  changes,
  syncStatus,
}: {
  project: ProjectWith<'scalingInfo' | 'statuses', 'countdowns'>
  changes: ProjectChanges | undefined
  syncStatus: SyncStatus | undefined
}): CommonScalingEntry {
  const isRollup =
    project.scalingInfo.type === 'Optimistic Rollup' ||
    project.scalingInfo.type === 'ZK Rollup'
  return {
    id: project.id,
    slug: project.slug,
    name: project.name,
    nameSecondLine:
      project.scalingInfo.layer === 'layer2'
        ? undefined
        : `L3 on ${project.scalingInfo.hostChain.shortName ?? project.scalingInfo.hostChain.name}`,
    shortName: project.shortName,
    href: `/scaling/projects/${project.slug}`,
    statuses: {
      yellowWarning: project.statuses.yellowWarning,
      redWarning: project.statuses.redWarning,
      verificationWarning: project.statuses.isUnverified,
      underReview: getUnderReviewStatus({
        isUnderReview: project.statuses.isUnderReview,
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
      countdowns: project.countdowns,
    },
    tab:
      project.scalingInfo.isOther || project.scalingInfo.type === 'Other'
        ? 'Others'
        : isRollup
          ? 'Rollups'
          : 'ValidiumsAndOptimiums',
    stageOrder: getStageOrder(project.scalingInfo.stage),
    filterable: {
      isRollup,
      type: project.scalingInfo.type,
      stack: project.scalingInfo.stack ?? 'No stack',
      stage: project.scalingInfo.stage,
      purposes: project.scalingInfo.purposes,
      hostChain: project.scalingInfo.hostChain.name,
      daLayer: project.scalingInfo.daLayer,
      raas: project.scalingInfo.raas ?? 'No RaaS',
    },
  }
}

export function getCommonScalingEntry({
  project,
  changes,
  syncStatus,
}: Params): CommonScalingEntry {
  const isRollup =
    project.display.category === 'Optimistic Rollup' ||
    project.display.category === 'ZK Rollup'
  const stage = isProjectOther(project)
    ? { stage: 'NotApplicable' as const }
    : project.stage
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
      verificationWarning: !isVerified(project),
      underReview: getUnderReviewStatus({
        isUnderReview: isUnderReview(project),
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
      countdowns: getCountdowns(project),
    },
    tab: isProjectOther(project)
      ? 'Others'
      : isRollup
        ? 'Rollups'
        : 'ValidiumsAndOptimiums',
    stageOrder: getStageOrder(stage?.stage),
    filterable: {
      isRollup,
      type: isProjectOther(project) ? 'Other' : project.display.category,
      stack: project.display.provider ?? 'No stack',
      stage: getStage(stage),
      purposes: project.display.purposes,
      hostChain: project.type === 'layer2' ? 'Ethereum' : getHostChain(project),
      daLayer:
        getCurrentEntry(project.dataAvailability)?.layer.value ?? 'Unknown',
      raas: getRaas(project.badges ?? []),
    },
  }
}

function getStageOrder(stage: string | undefined): number {
  if (stage === 'Stage 2' || stage === 'Stage 1') {
    return 2
  }
  if (stage === 'Stage 0') {
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
