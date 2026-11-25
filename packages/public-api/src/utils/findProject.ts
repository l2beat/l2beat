import type { Project, ProjectService } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'

/**
 * Finds the project named by a `:projectId` route parameter, which takes an
 * id or a slug. The id wins, so calls made before slugs worked keep their
 * meaning. `select` lists the data the route needs: a project without it gets
 * its own message, so callers can tell "no such project" from "no data".
 */
export async function findProject<
  K extends ProjectKey = never,
  O extends ProjectKey = never,
>(
  ps: ProjectService,
  idOrSlug: string,
  query: { select?: K[]; optional?: O[]; dataName?: string },
): Promise<FindProjectResult<K, O>> {
  const id = await findProjectId(ps, idOrSlug)
  if (!id) {
    return {
      notFoundMessage: `No project has the id or slug "${idOrSlug}"`,
    }
  }

  const project = await ps.getProject({
    id,
    select: query.select,
    optional: query.optional,
  })
  if (!project) {
    return {
      notFoundMessage: `Project "${id}" has no ${query.dataName ?? 'data of this kind'}`,
    }
  }
  return { project }
}

export const PROJECT_ID_OR_SLUG_DESCRIPTION =
  "Project id or slug (the slug is the one in the project's website URL). If one project has this id and another this slug, the id wins."

export function projectNotFoundDescription(dataName?: string) {
  const noProject = 'No project has this id or slug'
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

async function findProjectId(
  ps: ProjectService,
  idOrSlug: string,
): Promise<ProjectId | undefined> {
  const byId = await ps.getProject({ id: ProjectId(idOrSlug) })
  if (byId) {
    return byId.id
  }
  const bySlug = await ps.getProject({ slug: idOrSlug })
  return bySlug?.id
}
