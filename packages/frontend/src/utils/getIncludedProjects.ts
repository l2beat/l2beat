import { ApiMain, ProjectId } from '@l2beat/types'

export function getIncludedProjects<T extends { id: ProjectId }>(
  projects: T[],
  apiMain: ApiMain,
) {
  return projects.filter((x) => !!apiMain.projects[x.id.toString()])
}
