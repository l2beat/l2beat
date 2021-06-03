import { Project } from '../projects'
import { TVLResult, ValueLockedChecker } from '../services/ValueLockedChecker'

export interface ProjectTVL {
  name: string
  bridges: TVLResult[]
}

export async function getProjectTVLs(
  projects: Project[],
  valueLockedChecker: ValueLockedChecker
) {
  const promised = projects.map(async (project) => {
    return {
      name: project.name,
      bridges: await valueLockedChecker.getProjectTVL(project),
    }
  })
  return Promise.all(promised)
}
