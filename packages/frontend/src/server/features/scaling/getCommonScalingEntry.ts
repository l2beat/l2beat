import type { Project } from '@l2beat/config'
import type { FilterableEntry } from '~/components/table/filters/filterableValue'
import { getRowBackgroundColor } from '~/components/table/utils/rowType'
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
  isLayer3: boolean
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
  const statuses = {
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
  }
  const tab = getScalingTab(project)

  return {
    id: project.id,
    slug: project.slug,
    icon: getProjectIcon(project.slug),
    name: project.name,
    isLayer3: project.scalingInfo.layer === 'layer3',
    nameSecondLine:
      project.scalingInfo.layer === 'layer2'
        ? undefined
        : `L3 on ${project.scalingInfo.hostChain.shortName ?? project.scalingInfo.hostChain.name}`,
    shortName: project.shortName,
    backgroundColor:
      tab === 'notReviewed' ? undefined : getRowBackgroundColor(statuses),
    statuses,
    tab,
    filterable: [
      ...(project.scalingInfo.type
        ? [
            {
              id: 'type' as const,
              value: project.scalingInfo.type,
            },
          ]
        : []),
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
      ...(project.scalingInfo.daLayer ?? ['Unknown']).map((daLayer) => ({
        id: 'daLayer' as const,
        value: daLayer,
      })),
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
