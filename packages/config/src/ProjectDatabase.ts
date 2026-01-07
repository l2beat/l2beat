import {
  type AssetId,
  assertUnreachable,
  type LegacyToken,
} from '@l2beat/shared-pure'
import sqlite3 from 'sqlite3'
import type { BaseProject } from './types'

type SqliteType =
  | 'TEXT PRIMARY KEY'
  | 'TEXT'
  | 'TEXT NOT NULL'
  | 'INTEGER'
  | 'INTEGER NOT NULL'
  | 'BOOLEAN'
type Schema<T> = {
  [K in keyof T]-?: SqliteType
}

const BASIC_KEYS = ['id', 'slug', 'name', 'shortName', 'addedAt']

const schema = {
  id: 'TEXT PRIMARY KEY',
  slug: 'TEXT NOT NULL',
  name: 'TEXT NOT NULL',
  shortName: 'TEXT',
  addedAt: 'INTEGER NOT NULL',

  statuses: 'TEXT',
  display: 'TEXT',
  colors: 'TEXT',
  ecosystemColors: 'TEXT',
  milestones: 'TEXT',
  chainConfig: 'TEXT',
  escrows: 'TEXT',

  bridgeInfo: 'TEXT',
  bridgeRisks: 'TEXT',
  bridgeTechnology: 'TEXT',

  scalingInfo: 'TEXT',
  scalingStage: 'TEXT',
  scalingRisks: 'TEXT',
  scalingDa: 'TEXT',
  scalingTechnology: 'TEXT',

  daLayer: 'TEXT',
  daBridge: 'TEXT',
  customDa: 'TEXT',

  proofVerification: 'TEXT',
  zkCatalogInfo: 'TEXT',

  tvsInfo: 'TEXT',
  tvsConfig: 'TEXT',
  activityConfig: 'TEXT',
  livenessInfo: 'TEXT',
  livenessConfig: 'TEXT',
  costsInfo: 'TEXT',
  trackedTxsConfig: 'TEXT',
  daTrackingConfig: 'TEXT',
  ecosystemInfo: 'TEXT',
  ecosystemConfig: 'TEXT',

  permissions: 'TEXT',
  contracts: 'TEXT',
  discoveryInfo: 'TEXT',

  isBridge: 'BOOLEAN',
  isScaling: 'BOOLEAN',
  isZkCatalog: 'BOOLEAN',
  isDaLayer: 'BOOLEAN',
  isUpcoming: 'BOOLEAN',
  archivedAt: 'INTEGER',
  hasTestnet: 'BOOLEAN',
} satisfies Schema<BaseProject>

export class ProjectDatabase {
  private readonly db: sqlite3.Database
  constructor(path: string) {
    this.db = new sqlite3.Database(path)
  }

  async init() {
    const entries = Object.entries(schema)
      .map(([name, type]) => `${name} ${type}`)
      .join(',\n')
    await this.query(`
      CREATE TABLE IF NOT EXISTS projects (
        ${entries}
      )`)
    await this.query('CREATE INDEX projects_slug ON projects(slug)')
    await this.query(`
      CREATE TABLE IF NOT EXISTS tokens (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL
      )`)
  }

  async saveProject(project: BaseProject) {
    const keys = Object.keys(schema) as (keyof BaseProject)[]
    const valueKeys = keys.map((_) => '?')
    await this.query(
      `INSERT INTO projects(${keys.join(', ')}) VALUES(${valueKeys.join(', ')})`,
      keys.map((k) => toSqliteValue(k, project[k])),
    )
  }

  async getProject(query: {
    id?: string
    slug?: string
    select: (keyof BaseProject)[]
    whereNull: (keyof BaseProject)[]
    whereNotNull: (keyof BaseProject)[]
  }): Promise<BaseProject | undefined> {
    const select = [...BASIC_KEYS, ...query.select]
    const where: string[] = []
    if (query.id !== undefined) {
      where.push('id = $1')
    } else if (query.slug !== undefined) {
      where.push('slug = $1')
    } else {
      throw new Error('Please provide id or slug')
    }
    for (const key of query.whereNull) {
      where.push(`${key} IS NULL`)
    }
    for (const key of query.whereNotNull) {
      where.push(`${key} IS NOT NULL`)
    }
    const rows = await this.query(
      `SELECT ${select.join(', ')} FROM projects WHERE ${where.join(' AND ')}`,
      [query.id ?? query.slug],
    )
    const row = rows[0]
    if (row) {
      return toBaseProject(row as Record<keyof BaseProject, unknown>)
    }
  }

  async getProjects(query: {
    ids?: string[]
    slugs?: string[]
    select: (keyof BaseProject)[]
    whereNull: (keyof BaseProject)[]
    whereNotNull: (keyof BaseProject)[]
  }): Promise<BaseProject[]> {
    const select = [...BASIC_KEYS, ...query.select]
    const where: string[] = []
    const parameters: unknown[] = []
    if (query.ids) {
      parameters.push(...query.ids)
      where.push(`id IN (${query.ids.map((_) => '?').join(', ')})`)
    }
    if (query.slugs) {
      parameters.push(...query.slugs)
      where.push(`id IN (${query.slugs.map((_) => '?').join(', ')})`)
    }
    for (const key of query.whereNull) {
      where.push(`${key} IS NULL`)
    }
    for (const key of query.whereNotNull) {
      where.push(`${key} IS NOT NULL`)
    }
    const whereStr = where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''
    const rows = await this.query(
      `SELECT ${select.join(', ')} FROM projects ${whereStr}`,
      parameters,
    )
    return rows.map((row) =>
      toBaseProject(row as Record<keyof BaseProject, unknown>),
    )
  }

  async saveToken(token: LegacyToken) {
    await this.query('INSERT INTO tokens(id, data) VALUES(?, ?)', [
      token.id,
      JSON.stringify(token),
    ])
  }

  async getToken(id: AssetId): Promise<LegacyToken | undefined> {
    const rows = await this.query('SELECT data FROM tokens WHERE id = ?', [id])
    const row = rows[0]
    if (row) {
      return JSON.parse((row as { data: string }).data) as LegacyToken
    }
  }

  async getTokens(): Promise<LegacyToken[]> {
    const rows = await this.query('SELECT data FROM tokens')
    return rows.map(
      (row): LegacyToken => JSON.parse((row as { data: string }).data),
    )
  }

  private query(query: string, values?: unknown[]): Promise<unknown[]> {
    return new Promise<unknown[]>((resolve, reject) => {
      this.db.all(query, values, (err: Error | null, rows: unknown[]) => {
        if (err) reject(err)
        resolve(rows)
      })
    })
  }
}

function toSqliteValue(key: keyof BaseProject, value: unknown) {
  if (BASIC_KEYS.includes(key)) {
    return value ?? null
  }
  const type = schema[key]
  switch (type) {
    case 'TEXT PRIMARY KEY':
    case 'TEXT':
    case 'TEXT NOT NULL':
      return value !== undefined ? JSON.stringify(value) : null
    case 'INTEGER':
    case 'INTEGER NOT NULL':
    case 'BOOLEAN':
      return value !== undefined ? Number(value) : null
    default:
      assertUnreachable(type)
  }
}

function fromSqliteValue(key: keyof BaseProject, value: unknown): unknown {
  if (BASIC_KEYS.includes(key)) {
    return value ?? undefined
  }
  const type = schema[key]
  switch (type) {
    case 'TEXT':
      return value !== null ? JSON.parse(value as string) : undefined
    case 'BOOLEAN':
      return value !== null ? Boolean(value) : undefined
    case 'INTEGER':
      return value !== null ? Number(value) : undefined
    case 'TEXT PRIMARY KEY':
    case 'TEXT NOT NULL':
    case 'INTEGER NOT NULL':
      throw new Error('Invalid type')
    default:
      assertUnreachable(type)
  }
}

function toBaseProject(row: Record<keyof BaseProject, unknown>): BaseProject {
  const project: Record<string, unknown> = {}
  let key: keyof BaseProject
  for (key in row) {
    project[key] = fromSqliteValue(key, row[key])
  }
  return project as unknown as BaseProject
}
