import type { Project } from '@l2beat/config'
import type { FilterableEntry } from '~/components/table/filters/filterable-value'
import { getUnderReviewStatus } from '~/utils/project/under-review'
import type { ProjectChanges } from '../projects-change-report/get-projects-change-report'
import type { CommonProjectEntry } from '../utils/get-common-project-entry'
import { getBadgeWithParams } from '~/utils/project/get-badge-with-params'
import { notUndefined } from '@l2beat/shared-pure'

export interface CommonScalingEntry
  extends CommonProjectEntry,
    FilterableEntry {
  tab: 'rollups' | 'validiumsAndOptimiums' | 'others'
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
      ? 'others'
      : isRollup
        ? 'rollups'
        : 'validiumsAndOptimiums',
    stageOrder: getStageOrder(project.scalingInfo.stage),
    filterable: [
      { id: 'type', value: project.scalingInfo.type },
      {
        id: 'stack',
        value: project.scalingInfo.stack ?? 'No stack',
      },
      { id: 'stage', value: project.scalingInfo.stage },
      ...project.scalingInfo.purposes.map((purpose) => ({
        id: 'purpose' as const,
        value: purpose,
      })),
      {
        id: 'hostChain',
        value: project.scalingInfo.hostChain.name,
      },
      { id: 'daLayer', value: project.scalingInfo.daLayer },
      {
        id: 'raas',
        value: project.scalingInfo.raas ?? 'No RaaS',
      },
    ],
    description: project.display?.description,
    badges: project.display.badges.map(getBadgeWithParams).filter(notUndefined),
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
