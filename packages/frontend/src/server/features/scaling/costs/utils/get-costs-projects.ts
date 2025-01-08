import { type Layer2, layer2s } from '@l2beat/config'
import { z } from 'zod'
import { isProjectOther } from '../../utils/is-project-other'

export const CostsProjectsFilter = z.discriminatedUnion('type', [
  z.object({
    type: z.enum(['all', 'rollups', 'others']),
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
      !p.isUpcoming &&
      (p.display.category === 'Optimistic Rollup' ||
        p.display.category === 'ZK Rollup'),
  )
}

function filterToCondition(
  filter: CostsProjectsFilter,
): (p: Layer2) => boolean {
  if (filter.type === 'others') {
    return (p) => isProjectOther(p)
  }
  if (filter.type === 'rollups') {
    return (p) =>
      p.display.category === 'Optimistic Rollup' ||
      p.display.category === 'ZK Rollup'
  }

  // All projects
  return () => true
}
