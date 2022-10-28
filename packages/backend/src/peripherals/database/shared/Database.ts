import { Logger } from '@l2beat/common'
import KnexConstructor, { Knex } from 'knex'
import path from 'path'

import { PolyglotMigrationSource } from './PolyglotMigrationSource'

export class Database {
  private readonly knex: Knex
  private migrated = false
  private version: string | null = null
  private onMigrationsComplete: () => void = () => {}
  private readonly migrationsComplete = new Promise<void>((resolve) => {
    this.onMigrationsComplete = resolve
  })

  constructor(
    connection: Knex.Config['connection'],
    private readonly logger: Logger,
  ) {
    this.logger = this.logger.for(this)
    this.knex = KnexConstructor({
      client: 'pg',
      connection,
      migrations: {
        migrationSource: new PolyglotMigrationSource(
          path.join(__dirname, '..', 'migrations'),
        ),
      },
      pool: {
        // https://knexjs.org/guide/#aftercreate
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        afterCreate: function (conn: { query: any }, done: any) {
          // eslint-disable-next-line  @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
          conn.query('SET timezone="UTC";', function (err: any) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            done(err, conn)
          })
        },
      },
    })
  }

  async getKnex() {
    if (!this.migrated) {
      await this.migrationsComplete
    }
    return this.knex
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
}
