import type { ProjectId } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'
import { getProjects } from './getProjects'

type BasicKeys = 'id' | 'slug' | 'name' | 'shortName' | 'addedAt'
type Key = Exclude<keyof BaseProject, BasicKeys>
// Black magic: https://stackoverflow.com/a/78872927
type OptionalToUndefined<T> = { [K in {} & keyof T]: T[K] }
type Simplify<T> = T extends object ? { [K in keyof T]: T[K] } : T

export type Project<K extends Key = never, O extends Key = never> = Simplify<
  Pick<Required<BaseProject>, K | BasicKeys> &
    OptionalToUndefined<Pick<BaseProject, O | BasicKeys>>
>

export class ProjectService {
  /** There should only be a single instance of ProjectService. */
  constructor(private _getProjects = getProjects) {}

  private projects: Promise<BaseProject[]> | undefined

  async getProject<K extends Key = never, O extends Key = never>(query: {
    id?: ProjectId
    slug?: string
    select?: K[]
    optional?: O[]
    where?: Key[]
    whereNot?: Key[]
  }): Promise<Project<K, O> | undefined> {
    const projects = await this.getAllProjects()
    const project = projects.find(
      createFilter({
        ids: query.id ? [query.id] : undefined,
        slugs: query.slug ? [query.slug] : undefined,
        ...query,
      }),
    )
    if (project) {
      return createMap(query)(project)
    }
  }

  async getProjects<K extends Key = never, O extends Key = never>(query: {
    ids?: ProjectId[]
    slugs?: string[]
    select?: K[]
    optional?: O[]
    where?: Key[]
    whereNot?: Key[]
  }): Promise<Project<K, O>[]> {
    const projects = await this.getAllProjects()
    return projects.filter(createFilter(query)).map(createMap(query))
  }

  private async getAllProjects() {
    if (!this.projects) {
      this.projects = Promise.resolve(this._getProjects())
    }
    return await this.projects
  }
}

function createFilter(query: {
  ids?: ProjectId[]
  slugs?: string[]
  select?: Key[]
  where?: Key[]
  whereNot?: Key[]
}) {
  return function filter(project: BaseProject): boolean {
    return (
      (!query.ids || query.ids.includes(project.id)) &&
      (!query.slugs || query.slugs.includes(project.slug)) &&
      (!query.select || query.select.every((key) => !!project[key])) &&
      (!query.where || query.where.every((key) => !!project[key])) &&
      (!query.whereNot || query.whereNot.every((key) => !project[key]))
    )
  }
}

function createMap<K extends Key, O extends Key>(query: {
  select?: K[]
  optional?: O[]
}) {
  const keys = [
    'id',
    'slug',
    'name',
    'shortName',
    'addedAt',
    ...(query.select ?? []),
    ...(query.optional ?? []),
  ] as (keyof Project<K, O>)[]
  return function map(project: BaseProject) {
    const result = {} as Project<K, O>
    for (const key of keys) {
      // biome-ignore lint/suspicious/noExplicitAny: Can't index for some reason
      result[key] = (project as any)[key]
    }
    return result
  }
}
