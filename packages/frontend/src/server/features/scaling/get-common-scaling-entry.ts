import type { Project } from '@l2beat/config'
import type { ActivityChartType } from '~/components/chart/activity/activity-chart'
import { getUnderReviewStatus } from '~/utils/project/under-review'
import type { ProjectChanges } from '../projects-change-report/get-projects-change-report'
import type { CommonProjectEntry } from '../utils/get-common-project-entry'

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

export interface CommonScalingEntry
  extends CommonProjectEntry,
    FilterableScalingEntry {
  tab: ActivityChartType
  /** 0 - n/a, 1 - stage0, 2 - stage1&2, 3 - ethereum */
  stageOrder: number
}

export function getCommonScalingEntry({
  project,
  changes,
  syncWarning,
}: {
  project: Project<'scalingInfo' | 'statuses' | 'display'>
  changes: ProjectChanges | undefined
  syncWarning?: string
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
        impactfulChange: !!changes?.impactfulChange,
      }),
      syncWarning,
      countdowns: {
        otherMigration: project.statuses.otherMigration,
      },
    },
    tab: project.scalingInfo.isOther
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
    description: project.display?.description,
    badges: project.display.badges,
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
