import type { Project } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { isProjectOther } from '../../utils/isProjectOther'

export const ActivityProjectFilter = v.union([
  v.object({
    type: v.enum([
      'all',
      'rollups',
      'validiumsAndOptimiums',
      'others',
      'withoutOthers',
    ] as const),
  }),
  v.object({ type: v.literal('projects'), projectIds: v.array(v.string()) }),
])
export type ActivityProjectFilter = v.infer<typeof ActivityProjectFilter>

export const ActivityProjectFilterType = v.enum([
  'all',
  'rollups',
  'validiumsAndOptimiums',
  'others',
  'projects',
])
export type ActivityProjectFilterType = v.infer<
  typeof ActivityProjectFilterType
>

export function createActivityProjectsFilter(
  filter: ActivityProjectFilter,
  previewRecategorisation: boolean,
): (project: Project<'scalingInfo' | 'statuses'>) => boolean {
  switch (filter.type) {
    case 'all':
      return (project) =>
        !(
          previewRecategorisation &&
          project.statuses.reviewStatus === 'initialReview'
        )
    case 'rollups':
      return (project) =>
        !isProjectOther(project.scalingInfo, previewRecategorisation) &&
        !(
          previewRecategorisation &&
          project.statuses.reviewStatus === 'initialReview'
        ) && // If previewRecategorisation is true, we exclude projects that are under initial review
        (project.scalingInfo.type === 'Optimistic Rollup' ||
          project.scalingInfo.type === 'ZK Rollup')
    case 'validiumsAndOptimiums':
      return (project) =>
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
        isProjectOther(project.scalingInfo, previewRecategorisation) &&
        !(
          previewRecategorisation &&
          project.statuses.reviewStatus === 'initialReview'
        )
    case 'projects':
      return (project) => new Set(filter.projectIds).has(project.id)
    case 'withoutOthers':
      return (project) =>
        !isProjectOther(project.scalingInfo, previewRecategorisation) &&
        !(
          previewRecategorisation &&
          project.statuses.reviewStatus === 'initialReview'
        ) &&
        (project.scalingInfo.type === 'Optimistic Rollup' ||
          project.scalingInfo.type === 'ZK Rollup' ||
          project.scalingInfo.type === 'Validium' ||
          project.scalingInfo.type === 'Optimium' ||
          project.scalingInfo.type === 'Plasma')
    default:
      assertUnreachable(filter)
  }
}
