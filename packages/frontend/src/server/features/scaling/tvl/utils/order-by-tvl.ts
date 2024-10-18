import { type ProjectId } from '@l2beat/shared-pure'

export function orderByTvl<
  T extends {
    id: ProjectId
    name: string
  },
>(projects: T[], tvls: Record<ProjectId, number>): T[] {
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

  return projects.sort(sortByTvl)
}
