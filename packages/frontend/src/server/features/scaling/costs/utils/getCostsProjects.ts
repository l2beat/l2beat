import type { Project } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { ps } from '~/server/projects'

// NOTE(radomski): Was a discriminatedUnion but l2beat/validate does not
// support it yet. It's a performance issue.
export const CostsProjectsFilter = v.union([
  v.object({ type: v.enum(['all', 'rollups', 'others']) }),
  v.object({
    type: v.literal('projects'),
    projectIds: v.array(v.string()),
  }),
])
export type CostsProjectsFilter = v.infer<typeof CostsProjectsFilter>

export async function getCostsProjects(
  filter: CostsProjectsFilter = { type: 'all' },
): Promise<Project<'trackedTxsConfig', 'archivedAt'>[]> {
  const projects = await ps.getProjects({
    select: ['trackedTxsConfig', 'scalingInfo', 'statuses'],
    optional: ['archivedAt'],
    whereNot: ['isUpcoming'],
  })

  const condition = filterToCondition(filter)
  return projects.filter((p) => condition(p))
}

function filterToCondition(
  filter: CostsProjectsFilter,
): (p: Project<'scalingInfo' | 'statuses'>) => boolean {
  switch (filter.type) {
    case 'all':
      return () => true
    case 'rollups':
      return (p) =>
        (p.scalingInfo.type === 'Optimistic Rollup' ||
          p.scalingInfo.type === 'ZK Rollup') &&
        !(p.statuses.reviewStatus === 'initialReview')
    case 'others':
      return (p) =>
        p.scalingInfo.type === 'Other' &&
        !(p.statuses.reviewStatus === 'initialReview')
    case 'projects':
      return (p) => new Set(filter.projectIds).has(p.id)
    default:
      assertUnreachable(filter)
  }
}
