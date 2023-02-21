import { ProjectId, TvlApiResponse } from '@l2beat/shared'

export function getIncludedProjects<T extends { id: ProjectId }>(
  projects: T[],
  tvlApiResponse: TvlApiResponse,
  showAllProjects = false,
) {
  if (showAllProjects) {
    return projects
  }
  return projects.filter((x) => !!tvlApiResponse.projects[x.id.toString()])
}
