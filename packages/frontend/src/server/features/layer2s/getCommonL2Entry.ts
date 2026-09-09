import type { Project, ProjectScalingProofSystem } from '@l2beat/config'
import type { FilterableEntry } from '~/components/table/filters/filterableValue'
import { getRowBackgroundColor } from '~/components/table/utils/rowType'
import { manifest } from '~/utils/Manifest'
import { getBadgeWithParamsAndLink } from '~/utils/project/getBadgeWithParams'
import { getUnderReviewStatus } from '~/utils/project/underReview'
import type { ProjectChanges } from '../projects-change-report/getProjectsChangeReport'
import type { CommonProjectEntry } from '../utils/getCommonProjectEntry'
import { getProjectVerification } from '../utils/getIsProjectVerified'

const proofSystemLabel: Record<ProjectScalingProofSystem['type'], string> = {
  Optimistic: 'Optimistic',
  Validity: 'Validity',
}

export interface CommonL2Entry extends CommonProjectEntry, FilterableEntry {
  tab: 'rollups' | 'validiumsAndOptimiums' | 'others'
  isLayer3: boolean
}

export function getCommonL2Entry({
  project,
  changes,
  syncWarning,
  ongoingAnomaly,
}: {
  project: Project<'scalingInfo' | 'statuses' | 'display', 'contracts'>
  changes: ProjectChanges | undefined
  syncWarning?: string
  ongoingAnomaly?: boolean
}): CommonL2Entry {
  const statuses = {
    yellowWarning: project.statuses.yellowWarning,
    redWarning: project.statuses.redWarning,
    verificationWarnings: getProjectVerification(project, changes).warnings,
    underReview: getUnderReviewStatus({
      isUnderReview: !!project.statuses.reviewStatus,
      impactfulChange: !!changes?.impactfulChange,
    }),
    syncWarning,
    emergencyWarning: project.statuses.emergencyWarning,
    ongoingAnomaly,
  }
  const tab = getL2Tab(project)

  return {
    id: project.id,
    slug: project.slug,
    icon: manifest.getUrl(`/icons/${project.slug}.png`),
    name: project.name,
    isLayer3: project.scalingInfo.layer === 'layer3',
    nameSecondLine:
      project.scalingInfo.layer === 'layer2'
        ? undefined
        : `L3 on ${project.scalingInfo.hostChain.shortName ?? project.scalingInfo.hostChain.name}`,
    shortName: project.shortName,
    backgroundColor: getRowBackgroundColor(statuses),
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
      {
        id: 'ProofSystem' as const,
        value: project.scalingInfo.proofSystem
          ? proofSystemLabel[project.scalingInfo.proofSystem.type]
          : 'No proofs',
      },
      ...project.display.badges
        .filter((badge) => badge.type === 'Other')
        .map((badge) => ({
          id: 'other' as const,
          value: badge.name,
        })),
    ],
    description: project.display?.description,
    badges: project.display.badges
      .map((badge) => getBadgeWithParamsAndLink(badge, project))
      .filter((b) => b !== undefined),
  }
}

export function getL2Tab(
  project: Project<'scalingInfo' | 'statuses'>,
): 'rollups' | 'validiumsAndOptimiums' | 'others' {
  const isRollup =
    project.scalingInfo.type === 'Optimistic Rollup' ||
    project.scalingInfo.type === 'ZK Rollup'

  return project.scalingInfo.type === 'Other'
    ? 'others'
    : isRollup
      ? 'rollups'
      : 'validiumsAndOptimiums'
}
