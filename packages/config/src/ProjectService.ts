import type { AssetId, LegacyToken, ProjectId } from '@l2beat/shared-pure'
import { join } from 'path'
import { ProjectDatabase } from './ProjectDatabase'
import type { BaseProject } from './types'

type BasicKeys = 'id' | 'slug' | 'name' | 'shortName' | 'addedAt'
type Key = Exclude<keyof BaseProject, BasicKeys>
// Black magic: https://stackoverflow.com/a/78872927
type OptionalToUndefined<T> = { [K in {} & keyof T]: T[K] }
type Simplify<T> = T extends object ? { [K in keyof T]: T[K] } : T

export type Project<K extends Key = never, O extends Key = never> = Simplify<
  Pick<Required<BaseProject>, K | BasicKeys> &
    OptionalToUndefined<Pick<BaseProject, O | BasicKeys>>
>

// we are in build/ProjectService.js and we want build/db.sqlite
const DEFAULT_DB_LOCATION = join(__dirname, 'db.sqlite')

export class ProjectService {
  db: ProjectDatabase

  constructor(location = DEFAULT_DB_LOCATION) {
    this.db = new ProjectDatabase(location)
  }

  getProject<K extends Key = never, O extends Key = never>(query: {
    id?: ProjectId
    slug?: string
    select?: K[]
    optional?: O[]
    where?: Key[]
    whereNot?: Key[]
  }): Promise<Project<K, O> | undefined> {
    return new Promise((resolve) => {
      const result = this.db.getProject({
        id: query.id,
        slug: query.slug,
        select: [...(query.select ?? []), ...(query.optional ?? [])],
        whereNotNull: [...(query.select ?? []), ...(query.where ?? [])],
        whereNull: query.whereNot ?? [],
      })
      resolve(result as Project<K, O> | undefined)
    })
  }

  getProjects<K extends Key = never, O extends Key = never>(query: {
    ids?: ProjectId[]
    slugs?: string[]
    select?: K[]
    optional?: O[]
    where?: Key[]
    whereNot?: Key[]
  }): Promise<Project<K, O>[]> {
    return new Promise((resolve) => {
      const result = this.db.getProjects({
        ids: query.ids,
        slugs: query.slugs,
        select: [...(query.select ?? []), ...(query.optional ?? [])],
        whereNotNull: [...(query.select ?? []), ...(query.where ?? [])],
        whereNull: query.whereNot ?? [],
      })
      resolve(result as Project<K, O>[])
    })
  }

  getToken(id: AssetId): Promise<LegacyToken | undefined> {
    return new Promise((resolve) => resolve(this.db.getToken(id)))
  }

  getTokens(): Promise<LegacyToken[]> {
    return new Promise((resolve) => resolve(this.db.getTokens()))
  }
}
