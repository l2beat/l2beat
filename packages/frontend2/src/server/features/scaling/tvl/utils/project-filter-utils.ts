import { type TvlProject } from './get-tvl-projects'

export type TvlProjectFilter =
  | { type: 'all' | TvlProject['type'] }
  | { type: 'projects'; projectIds: string[] }

export type TvlLayer2ProjectFilter = TvlProjectFilter & {
  type: 'layer2' | 'projects'
}

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
