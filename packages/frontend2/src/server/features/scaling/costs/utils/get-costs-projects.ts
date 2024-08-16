import { type Layer2, layer2s } from '@l2beat/config'
import { COSTS_UPCOMING_PROJECTS } from '../consts'
import { z } from 'zod'

export const CostsChartFilter = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('all'),
  }),
  z.object({
    type: z.literal('projects'),
    projectIds: z.array(z.string()),
  }),
])
export type CostsChartFilter = z.infer<typeof CostsChartFilter>

export function getCostsProjects(filter: CostsChartFilter = { type: 'all' }): Layer2[] {
  const condition = filterToCondition(filter)
  return layer2s.filter(
    (p) =>
      condition(p) &&
      (p.config.trackedTxs !== undefined ||
        COSTS_UPCOMING_PROJECTS.includes(p.id.toString())) &&
      !p.isArchived &&
      !p.isUpcoming &&
      (p.display.category === 'Optimistic Rollup' ||
        p.display.category === 'ZK Rollup'),
  )
}

function filterToCondition(filter: CostsChartFilter): (p: Layer2) => boolean {
  if (filter.type === 'all') {
    return () => true
  }
  return (p) => filter.projectIds.includes(p.id)
}
