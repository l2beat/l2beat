import { Project } from '../projects'
import { BridgeTVL, ValueLockedChecker } from '../services/ValueLockedChecker'

export interface ProjectTVL {
  name: string
  bridges: BridgeTVL[]
}

export async function getProjectTVLs(
  projects: Project[],
  valueLockedChecker: ValueLockedChecker
): Promise<ProjectTVL[]> {
  const promised = projects.map(async (project) => {
    return {
      name: project.name,
      bridges: await valueLockedChecker.getProjectTVL(project),
    }
  })
  return Promise.all(promised)
}
