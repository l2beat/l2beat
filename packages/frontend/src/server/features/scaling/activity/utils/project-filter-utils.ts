import { type Layer2, type Layer3 } from '@l2beat/config'
import { z } from 'zod'

export const ActivityProjectFilter = z.union([
  z.object({ type: z.literal('all') }),
  z.object({ type: z.literal('projects'), projectIds: z.array(z.string()) }),
])

export type ActivityProjectFilter = z.infer<typeof ActivityProjectFilter>

export function createActivityProjectsFilter(
  filter: ActivityProjectFilter,
): (project: Layer2 | Layer3) => boolean {
  if (filter.type === 'all') {
    return () => true
  }

  const projectIds = new Set(filter.projectIds)
  return (project) => projectIds.has(project.id)
}
