import type { Project } from '@l2beat/config'
import type { FilterableEntry } from '~/components/table/filters/filterable-value'
import { getBadgeWithParams } from '~/utils/project/get-badge-with-params'
import { getUnderReviewStatus } from '~/utils/project/under-review'
import type { ProjectChanges } from '../projects-change-report/get-projects-change-report'
import type { CommonProjectEntry } from '../utils/get-common-project-entry'

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
    tab: getScalingTab(project),
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
      { id: 'daLayer', value: project.scalingInfo.daLayer ?? 'Unknown' },
      {
        id: 'raas',
        value: project.scalingInfo.raas ?? 'No RaaS',
      },
      {
        id: 'infrastructure',
        value: project.scalingInfo.infrastructure ?? 'No infrastructure',
      },
      ...project.scalingInfo.vm.map((vm) => ({
        id: 'vm' as const,
        value: vm,
      })),
    ],
    description: project.display?.description,
    badges: project.display.badges
      .map((badge) => getBadgeWithParams(badge))
      .filter((b) => b !== undefined),
  }
}

export function getScalingTab(
  project: Project<'scalingInfo'>,
): 'rollups' | 'validiumsAndOptimiums' | 'others' {
  const isRollup =
    project.scalingInfo.type === 'Optimistic Rollup' ||
    project.scalingInfo.type === 'ZK Rollup'

  return project.scalingInfo.isOther
    ? 'others'
    : isRollup
      ? 'rollups'
      : 'validiumsAndOptimiums'
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
