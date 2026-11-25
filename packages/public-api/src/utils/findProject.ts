import type { Project, ProjectService } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'

/**
 * Finds the project named by a `:projectId` route parameter. `select` lists
 * the data the route needs: a project without it gets its own message, so
 * callers can tell "no such project" from "no data".
 */
export async function findProject<
  K extends ProjectKey = never,
  O extends ProjectKey = never,
>(
  ps: ProjectService,
  projectId: string,
  query: { select?: K[]; optional?: O[]; dataName?: string },
): Promise<FindProjectResult<K, O>> {
  const id = ProjectId(projectId)
  const project = await ps.getProject({
    id,
    select: query.select,
    optional: query.optional,
  })
  if (project) {
    return { project }
  }

  const exists = query.select && (await ps.getProject({ id })) !== undefined
  if (!exists) {
    return { notFoundMessage: `No project has the id "${projectId}"` }
  }
  return {
    notFoundMessage: `Project "${id}" has no ${query.dataName ?? 'data of this kind'}`,
  }
}

export function projectNotFoundDescription(dataName?: string) {
  const noProject = 'No project has this id'
  if (!dataName) {
    return `${noProject}.`
  }
  return `${noProject}, or the project has no ${dataName}. The message says which.`
}

export type FindProjectResult<K extends ProjectKey, O extends ProjectKey> =
  | { project: Project<K, O>; notFoundMessage?: undefined }
  | { project?: undefined; notFoundMessage: string }

type ProjectKey = NonNullable<
  Parameters<ProjectService['getProject']>[0]['select']
>[number]
