import type { Layer2 } from '@l2beat/config'
import { layer2s } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
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
  previewRecategorisation = false,
): Layer2[] {
  const condition = filterToCondition(filter, previewRecategorisation)
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
  previewRecategorisation: boolean,
): (p: Layer2) => boolean {
  switch (filter.type) {
    case 'all':
      return () => true
    case 'rollups':
      return (p) =>
        (p.display.category === 'Optimistic Rollup' ||
          p.display.category === 'ZK Rollup') &&
        !isProjectOther(p, previewRecategorisation) &&
        !(previewRecategorisation && p.isUnderReview) // If previewRecategorisation is true, we exclude projects that are under review
    case 'others':
      return (p) =>
        isProjectOther(p, previewRecategorisation) &&
        !(previewRecategorisation && p.isUnderReview)
    case 'projects':
      return (p) => new Set(filter.projectIds).has(p.id)
    default:
      assertUnreachable(filter)
  }
}
