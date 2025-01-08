import { assertUnreachable } from '@l2beat/shared-pure'
import { z } from 'zod'
import { type BaseProject } from './get-tvl-projects'

export const TvlProjectFilter = z.discriminatedUnion('type', [
  z.object({
    type: z.enum([
      'layer2',
      'rollups',
      'validiumsAndOptimiums',
      'others',
      'bridge',
    ]),
  }),
  z.object({
    type: z.literal('projects'),
    projectIds: z.array(z.string()),
  }),
])
export type TvlProjectFilter = z.infer<typeof TvlProjectFilter>

export function createTvlProjectsFilter(
  filter: TvlProjectFilter,
): (project: BaseProject) => boolean {
  switch (filter.type) {
    case 'layer2':
    case 'bridge':
      return (project) => project.type === filter.type
    case 'projects':
      return (project) => new Set(filter.projectIds).has(project.projectId)
    case 'rollups':
    case 'validiumsAndOptimiums':
    case 'others':
      throw new Error('Invalid filter type')
    default:
      assertUnreachable(filter)
  }
}
