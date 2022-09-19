import { ApiMain, ProjectId } from '@l2beat/types'

export function orderByTvl<T extends { id: ProjectId }>(
  projects: T[],
  apiMain: Pick<ApiMain, 'projects'>,
): T[] {
  const getTvl = (project: T) =>
    apiMain.projects[project.id.toString()]?.charts.hourly.data.at(-1)?.[1] ?? 0
  return [...projects].sort((a, b) => getTvl(b) - getTvl(a))
}
