import type { Project } from '@l2beat/config'
import type { FilterableEntry } from '~/components/table/filters/filterableValue'
import { getBadgeWithParams } from '~/utils/project/getBadgeWithParams'
import { getUnderReviewStatus } from '~/utils/project/underReview'
import type { ProjectChanges } from '../projects-change-report/getProjectsChangeReport'
import type { CommonProjectEntry } from '../utils/getCommonProjectEntry'
import { getIsProjectVerified } from '../utils/getIsProjectVerified'
import { getProjectIcon } from '../utils/getProjectIcon'

export interface CommonScalingEntry
  extends CommonProjectEntry,
    FilterableEntry {
  tab: 'rollups' | 'validiumsAndOptimiums' | 'others' | 'notReviewed'
  /** 0 - n/a, 1 - stage0, 2 - stage1&2, 3 - ethereum */
  stageOrder: number
}

export function getCommonScalingEntry({
  project,
  changes,
  syncWarning,
  ongoingAnomaly,
}: {
  project: Project<'scalingInfo' | 'statuses' | 'display'>
  changes: ProjectChanges | undefined
  syncWarning?: string
  ongoingAnomaly?: boolean
}): CommonScalingEntry {
  return {
    id: project.id,
    slug: project.slug,
    icon: getProjectIcon(project.slug),
    name: project.name,
    nameSecondLine:
      project.scalingInfo.layer === 'layer2'
        ? undefined
        : `L3 on ${project.scalingInfo.hostChain.shortName ?? project.scalingInfo.hostChain.name}`,
    shortName: project.shortName,
    statuses: {
      yellowWarning: project.statuses.yellowWarning,
      redWarning: project.statuses.redWarning,
      verificationWarning: !getIsProjectVerified(
        project.statuses.unverifiedContracts,
        changes,
      ),
      underReview: getUnderReviewStatus({
        isUnderReview: !!project.statuses.reviewStatus,
        impactfulChange: !!changes?.impactfulChange,
      }),
      syncWarning,
      emergencyWarning: project.statuses.emergencyWarning,
      ongoingAnomaly,
    },
    tab: getScalingTab(project),
    stageOrder: getStageOrder(project.scalingInfo.stage),
    filterable: [
      { id: 'type', value: project.scalingInfo.type },
      ...(project.scalingInfo.stacks ?? ['No stack']).map((stack) => ({
        id: 'stack' as const,
        value: stack,
      })),
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
      ...project.display.badges
        .filter((badge) => badge.type === 'Other')
        .map((badge) => ({
          id: 'other' as const,
          value: badge.name,
        })),
    ],
    description: project.display?.description,
    badges: project.display.badges
      .map((badge) => getBadgeWithParams(badge))
      .filter((b) => b !== undefined),
  }
}

export function getScalingTab(
  project: Project<'scalingInfo' | 'statuses'>,
): 'rollups' | 'validiumsAndOptimiums' | 'others' | 'notReviewed' {
  const isRollup =
    project.scalingInfo.type === 'Optimistic Rollup' ||
    project.scalingInfo.type === 'ZK Rollup'

  return project.statuses.reviewStatus === 'initialReview'
    ? 'notReviewed'
    : project.scalingInfo.type === 'Other'
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
