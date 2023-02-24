import { ProjectId, TvlApiResponse } from '@l2beat/shared'
import { partition } from 'lodash'

export function orderByTvl<T extends { id: ProjectId; isArchived?: boolean }>(
  projects: T[],
  tvlApiResponse: Pick<TvlApiResponse, 'projects'>,
): T[] {
  const [active, archived] = partition(
    projects,
    (project) => !project.isArchived,
  )
  const getTvl = (project: T) =>
    tvlApiResponse.projects[project.id.toString()]?.charts.hourly.data.at(
      -1,
    )?.[1] ?? 0

  const sortByTvl = (a: T, b: T) => getTvl(b) - getTvl(a)

  return [...active].sort(sortByTvl).concat([...archived].sort(sortByTvl))
}
