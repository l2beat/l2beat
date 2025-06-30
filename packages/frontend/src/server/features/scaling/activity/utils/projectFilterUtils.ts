import type { Project } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

// NOTE(radomski): Was a discriminatedUnion but l2beat/validate does not
// support it yet. It's a performance issue.
export const ActivityProjectFilter = v.union([
  v.object({
    type: v.enum([
      'all',
      'rollups',
      'validiumsAndOptimiums',
      'others',
      'withoutOthers',
    ]),
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
): (project: Project<'scalingInfo' | 'statuses'>) => boolean {
  switch (filter.type) {
    case 'all':
      return (project) => !(project.statuses.reviewStatus === 'initialReview')
    case 'rollups':
      return (project) =>
        !(project.statuses.reviewStatus === 'initialReview') &&
        (project.scalingInfo.type === 'Optimistic Rollup' ||
          project.scalingInfo.type === 'ZK Rollup')
    case 'validiumsAndOptimiums':
      return (project) =>
        !(project.statuses.reviewStatus === 'initialReview') &&
        (project.scalingInfo.type === 'Validium' ||
          project.scalingInfo.type === 'Optimium' ||
          project.scalingInfo.type === 'Plasma')
    case 'others':
      return (project) =>
        project.scalingInfo.type === 'Other' &&
        !(project.statuses.reviewStatus === 'initialReview')
    case 'projects':
      return (project) => new Set(filter.projectIds).has(project.id)
    case 'withoutOthers':
      return (project) =>
        project.scalingInfo.type !== 'Other' &&
        !(project.statuses.reviewStatus === 'initialReview')
    default:
      assertUnreachable(filter)
  }
}
