import { ProjectId, TvlApiResponse } from '@l2beat/types'

export function getIncludedProjects<T extends { id: ProjectId }>(
  projects: T[],
  tvlResponse: TvlApiResponse,
) {
  return projects.filter((x) => !!tvlResponse.projects[x.id.toString()])
}
