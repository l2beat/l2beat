import { type ProjectId } from '@l2beat/shared-pure'

export function orderByTvl<
  T extends {
    id: ProjectId
    name: string
    isArchived?: boolean
    isUpcoming?: boolean
  },
>(projects: T[], tvls: Record<ProjectId, number>): T[] {
  const active = projects.filter(
    (project) => !project.isArchived && !project.isUpcoming,
  )
  const archived = projects.filter((project) => project.isArchived)
  const upcoming = projects.filter((project) => project.isUpcoming)

  const getTvl = (project: T) => {
    const tvl = tvls[project.id]
    return tvl ?? 0
  }

  const sortByTvl = (a: T, b: T) => {
    const aTvl = getTvl(a)
    const bTvl = getTvl(b)
    if (aTvl === bTvl) {
      return a.name.localeCompare(b.name)
    }
    return bTvl - aTvl
  }

  return [...active]
    .sort(sortByTvl)
    .concat(...upcoming)
    .concat([...archived].sort(sortByTvl))
}
