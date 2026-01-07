import type { Project } from '@l2beat/config'
import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import type { SevenDayTvsBreakdown } from '../../scaling/tvs/get7dTvsBreakdown'

export function tvsComparatorWithDaBridges(
  allProjects: Project<never, 'daBridge'>[],
  tvs: SevenDayTvsBreakdown,
) {
  const getTvs = (projectId: string): number => {
    const project = allProjects.find((p) => p.id === projectId)
    if (project?.daBridge) {
      return project.daBridge.usedIn.reduce(
        (acc, p) => acc + (tvs.projects[p.id]?.breakdown.total ?? 0),
        0,
      )
    }
    return tvs.projects[projectId]?.breakdown.total ?? 0
  }

  return (a: UsedInProjectWithIcon, b: UsedInProjectWithIcon) =>
    getTvs(b.id) - getTvs(a.id)
}
