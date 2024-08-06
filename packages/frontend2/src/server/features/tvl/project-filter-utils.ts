import { z } from 'zod'
import { type TvlProject } from './get-tvl-projects'

export const scalingCommonProjectsFilter = z.object({
  rollupsOnly: z.boolean(),
  category: z.string().optional(),
  stack: z.string().optional(),
  stage: z.string().optional(),
  purpose: z.string().optional(),
  hostChain: z.string().optional(),
  daLayer: z.string().optional(),
})

export const scalingTvlFilter = scalingCommonProjectsFilter.extend({
  excludeAssociatedTokens: z.boolean(),
})

export type TvlProjectFilter =
  | { type: 'all' | TvlProject['type'] }
  | { type: 'projects'; projectIds: string[] }

export function createTvlProjectsFilter(
  filter: TvlProjectFilter,
): (project: TvlProject) => boolean {
  if (filter.type === 'all') {
    return () => true
  }

  if (filter.type === 'projects') {
    const projectIds = new Set(filter.projectIds)
    return (project: TvlProject) => projectIds.has(project.id)
  }

  return (project: TvlProject) => project.type === filter.type
}
