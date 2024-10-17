import { type Layer2, layer2s } from '@l2beat/config'
import { z } from 'zod'

export const CostsProjectsFilter = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('all'),
  }),
  z.object({
    type: z.literal('projects'),
    projectIds: z.array(z.string()),
  }),
])
export type CostsProjectsFilter = z.infer<typeof CostsProjectsFilter>

export function getCostsProjects(
  filter: CostsProjectsFilter = { type: 'all' },
): Layer2[] {
  const condition = filterToCondition(filter)
  return layer2s.filter(
    (p) =>
      condition(p) &&
      p.config.trackedTxs !== undefined &&
      !p.isArchived &&
      !p.isUpcoming &&
      (p.display.category === 'Optimistic Rollup' ||
        p.display.category === 'ZK Rollup'),
  )
}

function filterToCondition(
  filter: CostsProjectsFilter,
): (p: Layer2) => boolean {
  if (filter.type === 'all') {
    return () => true
  }
  return (p) => filter.projectIds.includes(p.id)
}
