import type { Project } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import { z } from 'zod'
import { isProjectOther } from '../../utils/is-project-other'

export const ActivityProjectFilter = z.discriminatedUnion('type', [
  z.object({
    type: z.enum(['all', 'rollups', 'validiumsAndOptimiums', 'others']),
  }),
  z.object({ type: z.literal('projects'), projectIds: z.array(z.string()) }),
])

export type ActivityProjectFilter = z.infer<typeof ActivityProjectFilter>

export function createActivityProjectsFilter(
  filter: ActivityProjectFilter,
  previewRecategorisation: boolean,
): (project: Project<'scalingInfo' | 'statuses'>) => boolean {
  switch (filter.type) {
    case 'all':
      return () => true
    case 'rollups':
      return (project) =>
        !isProjectOther(project.scalingInfo, previewRecategorisation) &&
        !(previewRecategorisation && project.statuses.isUnderReview) && // If previewRecategorisation is true, we exclude projects that are under review
        (project.scalingInfo.type === 'Optimistic Rollup' ||
          project.scalingInfo.type === 'ZK Rollup')
    case 'validiumsAndOptimiums':
      return (project) =>
        !isProjectOther(project.scalingInfo, previewRecategorisation) &&
        !(previewRecategorisation && project.statuses.isUnderReview) &&
        (project.scalingInfo.type === 'Validium' ||
          project.scalingInfo.type === 'Optimium' ||
          project.scalingInfo.type === 'Plasma')
    case 'others':
      return (project) =>
        isProjectOther(project.scalingInfo, previewRecategorisation) &&
        !(previewRecategorisation && project.statuses.isUnderReview)
    case 'projects':
      return (project) => new Set(filter.projectIds).has(project.id)
    default:
      assertUnreachable(filter)
  }
}
