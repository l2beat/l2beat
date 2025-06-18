import type { Project } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { ps } from '~/server/projects'
import { isProjectOther } from '../../utils/isProjectOther'

export const CostsProjectsFilter = v.union([
  v.object({
    type: v.enum(['all', 'rollups', 'others'] as const),
  }),
  v.object({
    type: v.literal('projects'),
    projectIds: v.array(v.string()),
  }),
])
export type CostsProjectsFilter = v.infer<typeof CostsProjectsFilter>

export async function getCostsProjects(
  filter: CostsProjectsFilter = { type: 'all' },
  previewRecategorisation = false,
): Promise<Project<'trackedTxsConfig', 'archivedAt'>[]> {
  const projects = await ps.getProjects({
    select: ['trackedTxsConfig', 'scalingInfo', 'statuses'],
    optional: ['archivedAt'],
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
        !isProjectOther(p.scalingInfo, previewRecategorisation) &&
        !(
          previewRecategorisation && p.statuses.reviewStatus === 'initialReview'
        ) // If previewRecategorisation is true, we exclude projects that are under initial review
    case 'others':
      return (p) =>
        isProjectOther(p.scalingInfo, previewRecategorisation) &&
        !(
          previewRecategorisation && p.statuses.reviewStatus === 'initialReview'
        )
    case 'projects':
      return (p) => new Set(filter.projectIds).has(p.id)
    default:
      assertUnreachable(filter)
  }
}
