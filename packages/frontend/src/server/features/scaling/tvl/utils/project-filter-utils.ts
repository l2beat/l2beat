import { z } from 'zod'
import { type BaseProject } from './get-tvl-projects'

export const TvlProjectFilter = z.discriminatedUnion('type', [
  z.object({
    type: z.enum(['all', 'layer2', 'bridge']),
  }),
  z.object({
    type: z.literal('projects'),
    projectIds: z.array(z.string()),
  }),
])
export type TvlProjectFilter = z.infer<typeof TvlProjectFilter>

export function createTvlProjectsFilter(filter: TvlProjectFilter) {
  if (filter.type === 'all') {
    return () => true
  }

  if (filter.type === 'projects') {
    const projectIds = new Set(filter.projectIds)
    return (project: BaseProject) => projectIds.has(project.projectId)
  }

  return (project: BaseProject) => project.type === filter.type
}
