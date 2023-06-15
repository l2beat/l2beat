import { Logger, LogLevel } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import KnexConstructor, { Knex } from 'knex'
import path from 'path'

import { configureUtc } from './configureUtc'
import { PolyglotMigrationSource } from './PolyglotMigrationSource'
interface VersionQueryResult {
  rows: {
    server_version: string
  }[]
}

export interface DatabaseOpts {
  requiredMajorVersion?: number
  minConnectionPoolSize?: number
  maxConnectionPoolSize?: number
}

const REQUIRED_MAJOR_VERSION = 14

export class Database {
  private readonly knex: Knex
  private migrated = false
  private version: string | null = null
  private onMigrationsComplete: () => void = () => {}
  private readonly migrationsComplete = new Promise<void>((resolve) => {
    this.onMigrationsComplete = resolve
  })
  private readonly requiredMajorVersion: number

  constructor(
    connection: Knex.Config['connection'],
    name: string,
    private readonly logger: Logger,
    readonly opts?: DatabaseOpts,
  ) {
    configureUtc()

    const connectionWithName =
      typeof connection === 'object'
        ? { ...connection, application_name: name }
        : connection

    this.logger = this.logger.for(this)
    this.requiredMajorVersion =
      opts?.requiredMajorVersion ?? REQUIRED_MAJOR_VERSION
    this.knex = KnexConstructor({
      client: 'pg',
      connection: connectionWithName,
      migrations: {
        migrationSource: new PolyglotMigrationSource(
          path.join(__dirname, '..', 'migrations'),
        ),
      },
      pool: {
        min: opts?.minConnectionPoolSize,
        max: opts?.maxConnectionPoolSize,
      },
    })
  }

  async getKnex(trx?: Knex.Transaction) {
    if (!this.migrated) {
      await this.migrationsComplete
    }
    return trx ?? this.knex
  }

  getStatus() {
    return { migrated: this.migrated, version: this.version }
  }

  skipMigrations() {
    this.onMigrationsComplete()
    this.migrated = true
  }

  async migrateToLatest() {
    await this.knex.migrate.latest()
    const version = await this.knex.migrate.currentVersion()
    this.version = version
    this.onMigrationsComplete()
    this.migrated = true
    this.logger.info('Migrations completed', { version })
  }

  async rollbackAll() {
    this.migrated = false
    this.version = null
    await this.knex.migrate.rollback(undefined, true)
    this.logger.info('Migrations rollback completed')
  }

  async closeConnection() {
    await this.knex.destroy()
    this.logger.debug('Connection closed')
  }

  async assertRequiredServerVersion(): Promise<void> {
    const result: VersionQueryResult = await this.knex.raw(
      'show server_version',
    )
    const version = result.rows[0]?.server_version
    const major = Number(version.split('.')[0])
    assert(
      major === this.requiredMajorVersion,
      `Postgres server major version ${major} different than required ${this.requiredMajorVersion}`,
    )
  }

  enableQueryLogging(): void {
    if (this.logger.getLogLevel() >= LogLevel.DEBUG) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.knex.on('query', (queryCtx: { sql: string; bindings: any[] }) => {
        this.logger.debug('SQL Query', {
          query: queryCtx.sql,
          vars: queryCtx.bindings,
        })
      })
    }
  }
}
