import type { Project } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

// NOTE(radomski): Was a discriminatedUnion but l2beat/validate does not
// support it yet. It's a performance issue.
export const TvsProjectFilter = v.union([
  v.object({
    type: v.enum([
      'layer2',
      'rollups',
      'validiumsAndOptimiums',
      'others',
      'bridge',
    ]),
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
])
export type TvsProjectFilterType = v.infer<typeof TvsProjectFilterType>

export function createTvsProjectsFilter(
  filter: TvsProjectFilter,
): (project: Project<'statuses', 'scalingInfo' | 'isBridge'>) => boolean {
  switch (filter.type) {
    case 'layer2':
      return (project) =>
        !!project.scalingInfo &&
        !(project.statuses.reviewStatus === 'initialReview')
    case 'bridge':
      return (project) => !!project.isBridge
    case 'projects':
      return (project) => new Set(filter.projectIds).has(project.id)
    case 'rollups':
      return (project) =>
        !!project.scalingInfo &&
        !(project.statuses.reviewStatus === 'initialReview') &&
        (project.scalingInfo.type === 'Optimistic Rollup' ||
          project.scalingInfo.type === 'ZK Rollup')
    case 'validiumsAndOptimiums':
      return (project) =>
        !!project.scalingInfo &&
        !(project.statuses.reviewStatus === 'initialReview') &&
        (project.scalingInfo.type === 'Validium' ||
          project.scalingInfo.type === 'Optimium' ||
          project.scalingInfo.type === 'Plasma')
    case 'others':
      return (project) =>
        !!project.scalingInfo &&
        project.scalingInfo.type === 'Other' &&
        !(project.statuses.reviewStatus === 'initialReview')
    default:
      assertUnreachable(filter)
  }
}
