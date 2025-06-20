import type { Project } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import { z } from 'zod'
import { isProjectOther } from '../../utils/isProjectOther'

export const ActivityProjectFilter = z.discriminatedUnion('type', [
  z.object({
    type: z.enum([
      'all',
      'rollups',
      'validiumsAndOptimiums',
      'others',
      'withoutOthers',
    ]),
  }),
  z.object({ type: z.literal('projects'), projectIds: z.array(z.string()) }),
])
export type ActivityProjectFilter = z.infer<typeof ActivityProjectFilter>

export const ActivityProjectFilterType = z.enum([
  'all',
  'rollups',
  'validiumsAndOptimiums',
  'others',
  'projects',
])
export type ActivityProjectFilterType = z.infer<
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
