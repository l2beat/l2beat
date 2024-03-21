import { Logger } from '@l2beat/backend-tools'
import { assert } from '@l2beat/shared-pure'
import KnexConstructor, { Knex } from 'knex'
import path from 'path'

import { DatabaseConfig } from '../../config/Config'
import { configureUtc } from './configureUtc'
import { PolyglotMigrationSource } from './PolyglotMigrationSource'
interface VersionQueryResult {
  rows: {
    server_version: string
  }[]
}

const REQUIRED_MAJOR_VERSION = 14

export class Database {
  private readonly knex: Knex
  private migrated = false
  private onMigrationsComplete: () => void = () => {}
  private readonly migrationsComplete = new Promise<void>((resolve) => {
    this.onMigrationsComplete = resolve
  })
  private readonly requiredMajorVersion: number

  constructor(
    private readonly config: DatabaseConfig,
    private readonly logger: Logger,
    applicationName: string,
  ) {
    configureUtc()
    this.logger = this.logger.for(this)

    const connectionWithName =
      typeof config.connection === 'object'
        ? { ...config.connection, application_name: applicationName }
        : config.connection

    this.requiredMajorVersion =
      config.requiredMajorVersion ?? REQUIRED_MAJOR_VERSION

    this.knex = KnexConstructor({
      client: 'pg',
      connection: connectionWithName,
      migrations: {
        migrationSource: new PolyglotMigrationSource(
          path.join(__dirname, 'migrations'),
        ),
      },
      pool: config.connectionPoolSize,
    })
  }

  async getKnex(trx?: Knex.Transaction) {
    if (!this.migrated) {
      await this.migrationsComplete
    }
    return trx ?? this.knex
  }

  async closeConnection() {
    await this.knex.destroy()
    this.logger.debug('Connection closed')
  }

  async start() {
    if (this.config.enableQueryLogging) {
      this.enableQueryLogging()
    }
    await this.assertRequiredServerVersion()
    if (this.config.freshStart) {
      await this.rollbackAll()
    }
    await this.migrateToLatest()
  }

  async rollbackAll() {
    this.migrated = false
    await this.knex.migrate.rollback(undefined, true)
    this.logger.info('Migrations rollback completed')
  }

  async migrateToLatest() {
    await this.knex.migrate.latest()
    const version = await this.knex.migrate.currentVersion()
    this.onMigrationsComplete()
    this.migrated = true
    this.logger.info('Migrations completed', { version })
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

  private enableQueryLogging(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.knex.on('query', (queryCtx: { sql: string; bindings: any[] }) => {
      this.logger.trace('SQL Query', {
        query: queryCtx.sql,
        vars: queryCtx.bindings,
      })
    })
  }
}
