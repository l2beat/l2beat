import { ProjectId, TvlApiResponse } from '@l2beat/shared'

export function orderByTvl<T extends { id: ProjectId }>(
  projects: T[],
  tvlApiResponse: Pick<TvlApiResponse, 'projects'>,
): T[] {
  const getTvl = (project: T) =>
    tvlApiResponse.projects[project.id.toString()]?.charts.hourly.data.at(
      -1,
    )?.[1] ?? 0
  return [...projects].sort((a, b) => getTvl(b) - getTvl(a))
}
