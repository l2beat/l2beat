import type { Project } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { isProjectOther } from '../../utils/isProjectOther'

export const TvsProjectFilter = v.union([
  v.object({
    type: v.enum([
      'layer2',
      'rollups',
      'validiumsAndOptimiums',
      'others',
      'bridge',
    ] as const),
  }),
  v.object({
    type: v.literal('projects'),
    projectIds: v.array(v.string()),
  }),
])
export type TvsProjectFilter = v.infer<typeof TvsProjectFilter>

export const TvsProjectFilterType = v.enum([
  'layer2',
  'rollups',
  'validiumsAndOptimiums',
  'others',
  'bridge',
  'projects',
] as const)
export type TvsProjectFilterType = v.infer<typeof TvsProjectFilterType>

export function createTvsProjectsFilter(
  filter: TvsProjectFilter,
  previewRecategorisation?: boolean,
): (project: Project<'statuses', 'scalingInfo' | 'isBridge'>) => boolean {
  switch (filter.type) {
    case 'layer2':
      return (project) =>
        !!project.scalingInfo &&
        !(
          previewRecategorisation &&
          project.statuses.reviewStatus === 'initialReview'
        )
    case 'bridge':
      return (project) => !!project.isBridge
    case 'projects':
      return (project) => new Set(filter.projectIds).has(project.id)
    case 'rollups':
      return (project) =>
        !!project.scalingInfo &&
        !isProjectOther(project.scalingInfo, previewRecategorisation) &&
        !(
          previewRecategorisation &&
          project.statuses.reviewStatus === 'initialReview'
        ) && // If previewRecategorisation is true, we exclude projects that are under initial review
        (project.scalingInfo.type === 'Optimistic Rollup' ||
          project.scalingInfo.type === 'ZK Rollup')
    case 'validiumsAndOptimiums':
      return (project) =>
        !!project.scalingInfo &&
        !isProjectOther(project.scalingInfo, previewRecategorisation) &&
        !(
          previewRecategorisation &&
          project.statuses.reviewStatus === 'initialReview'
        ) &&
        (project.scalingInfo.type === 'Validium' ||
          project.scalingInfo.type === 'Optimium' ||
          project.scalingInfo.type === 'Plasma')
    case 'others':
      return (project) =>
        !!project.scalingInfo &&
        isProjectOther(project.scalingInfo, previewRecategorisation) &&
        !(
          previewRecategorisation &&
          project.statuses.reviewStatus === 'initialReview'
        )
    default:
      assertUnreachable(filter)
  }
}
