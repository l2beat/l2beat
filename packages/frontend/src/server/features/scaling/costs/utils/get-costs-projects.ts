import type { Project } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import { z } from 'zod'
import { ps } from '~/server/projects'
import { isProjectOther2 } from '../../utils/is-project-other'

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

export async function getCostsProjects(
  filter: CostsProjectsFilter = { type: 'all' },
  previewRecategorisation = false,
): Promise<Project<'trackedTxsConfig', 'isArchived'>[]> {
  const projects = await ps.getProjects({
    select: ['trackedTxsConfig', 'scalingInfo', 'statuses'],
    optional: ['isArchived'],
    whereNot: ['isUpcoming'],
  })

  const condition = filterToCondition(filter, previewRecategorisation)
  return projects.filter(
    (p) =>
      condition(p) &&
      (p.scalingInfo.type === 'Optimistic Rollup' ||
        p.scalingInfo.type === 'ZK Rollup'),
  )
}

function filterToCondition(
  filter: CostsProjectsFilter,
  previewRecategorisation: boolean,
): (p: Project<'scalingInfo' | 'statuses'>) => boolean {
  switch (filter.type) {
    case 'all':
      return () => true
    case 'rollups':
      return (p) =>
        (p.scalingInfo.type === 'Optimistic Rollup' ||
          p.scalingInfo.type === 'ZK Rollup') &&
        !isProjectOther2(p, previewRecategorisation) &&
        !(previewRecategorisation && p.statuses.isUnderReview) // If previewRecategorisation is true, we exclude projects that are under review
    case 'others':
      return (p) =>
        isProjectOther2(p, previewRecategorisation) &&
        !(previewRecategorisation && p.statuses.isUnderReview)
    case 'projects':
      return (p) => new Set(filter.projectIds).has(p.id)
    default:
      assertUnreachable(filter)
  }
}
