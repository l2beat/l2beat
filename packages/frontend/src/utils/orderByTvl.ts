import { ProjectId, TvlApiChart, TvlApiResponse } from '@l2beat/shared-pure'

export function orderByTvl<
  T extends { id: ProjectId; isArchived?: boolean; isUpcoming?: boolean },
>(
  projects: T[],
  tvlApiResponse: Pick<TvlApiResponse, 'projects'>,
  tvlType: Exclude<TvlApiChart['types'][number], 'timestamp'> = 'valueUsd',
): T[] {
  const active = projects.filter(
    (project) => !project.isArchived && !project.isUpcoming,
  )

  const archived = projects.filter((project) => project.isArchived)
  const upcoming = projects.filter((project) => project.isUpcoming)

  const getTvl = (project: T) => {
    const index =
      tvlApiResponse.projects[
        project.id.toString()
      ]?.charts.hourly.types.indexOf(tvlType)
    if (!index)
      throw new Error(
        `Project ${project.id.toString()} does not have ${tvlType} tvl`,
      )
    return (tvlApiResponse.projects[
      project.id.toString()
    ]?.charts.hourly.data.at(-1)?.[index] ?? 0) as number
  }

  const sortByTvl = (a: T, b: T) => getTvl(b) - getTvl(a)

  return [...active]
    .sort(sortByTvl)
    .concat(...upcoming)
    .concat([...archived].sort(sortByTvl))
}
