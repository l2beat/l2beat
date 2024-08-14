import { type TvlProject } from './get-tvl-projects'

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
