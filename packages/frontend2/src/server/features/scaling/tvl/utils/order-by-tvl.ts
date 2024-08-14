import { ProjectId } from '@l2beat/shared-pure'

const useTvlFromMap: Record<string, string> = {
  astarzkevm: 'polygonzkevm',
  xlayer: 'polygonzkevm',
}

export function orderByTvl<
  T extends { id: ProjectId; isArchived?: boolean; isUpcoming?: boolean },
>(projects: T[], tvls: Record<ProjectId, number>): T[] {
  const active = projects.filter(
    (project) => !project.isArchived && !project.isUpcoming,
  )
  const archived = projects.filter((project) => project.isArchived)
  const upcoming = projects.filter((project) => project.isUpcoming)

  const getTvl = (project: T) => {
    const tvl = tvls[project.id]

    if (tvl) {
      return tvl ?? 0
    }

    const useTvlFrom = useTvlFromMap[project.id.toString()]
    if (!useTvlFrom) return 0
    const useTvlFromValue = tvls[ProjectId(useTvlFrom)]
    return useTvlFromValue ? useTvlFromValue - 1 : 0
  }

  const sortByTvl = (a: T, b: T) => getTvl(b) - getTvl(a)

  return [...active]
    .sort(sortByTvl)
    .concat(...upcoming)
    .concat([...archived].sort(sortByTvl))
}
