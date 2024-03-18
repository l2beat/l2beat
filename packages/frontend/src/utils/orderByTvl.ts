import { ProjectId, TvlApiResponse } from '@l2beat/shared-pure'

const useTvlFromMap: Record<string, string> = {
  astarzkevm: 'polygonzkevm',
}

export function orderByTvl<
  T extends { id: ProjectId; isArchived?: boolean; isUpcoming?: boolean },
>(projects: T[], tvlApiResponse: Pick<TvlApiResponse, 'projects'>): T[] {
  const active = projects.filter(
    (project) => !project.isArchived && !project.isUpcoming,
  )
  const archived = projects.filter((project) => project.isArchived)
  const upcoming = projects.filter((project) => project.isUpcoming)

  const getTvl = (project: T) => {
    const tvl =
      tvlApiResponse.projects[project.id.toString()]?.charts.hourly.data.at(
        -1,
      )?.[1]

    if (tvl) {
      return tvl ?? 0
    }

    const useTvlFrom = useTvlFromMap[project.id.toString()]
    const useTvlFromValue =
      tvlApiResponse.projects[useTvlFrom]?.charts.hourly.data.at(-1)?.[1]
    return useTvlFromValue ? useTvlFromValue - 1 : 0
  }

  const sortByTvl = (a: T, b: T) => getTvl(b) - getTvl(a)

  return [...active]
    .sort(sortByTvl)
    .concat(...upcoming)
    .concat([...archived].sort(sortByTvl))
}
