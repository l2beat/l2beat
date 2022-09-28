import { ProjectId, TvlApiResponse } from '@l2beat/types'

export function orderByTvl<T extends { id: ProjectId }>(
  projects: T[],
  tvlResponse: Pick<TvlApiResponse, 'projects'>,
): T[] {
  const getTvl = (project: T) =>
    tvlResponse.projects[project.id.toString()]?.charts.hourly.data.at(
      -1,
    )?.[1] ?? 0
  return [...projects].sort((a, b) => getTvl(b) - getTvl(a))
}
