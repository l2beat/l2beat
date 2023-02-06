import { ProjectId, TvlApiResponse } from '@l2beat/shared'

export function getIncludedProjects<T extends { id: ProjectId }>(
  projects: T[],
  tvlApiResponse: TvlApiResponse,
) {
  return projects.filter((x) => !!tvlApiResponse.projects[x.id.toString()])
}
