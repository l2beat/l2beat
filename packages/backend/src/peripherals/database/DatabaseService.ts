import { Logger } from '@l2beat/common'
import KnexConstructor, { Knex } from 'knex'
import path from 'path'

export class DatabaseService {
  private migrated = false
  private version: string | null = null

  constructor(private knex: Knex, private logger: Logger) {
    this.logger = this.logger.for(this)
  }

  static createKnexInstance(connection: Knex.Config['connection']) {
    return KnexConstructor({
      client: 'pg',
      connection,
      migrations: {
        directory: path.join(__dirname, 'migrations'),
      },
    })
  }

  getStatus() {
    return { migrated: this.migrated, version: this.version }
  }

  async migrateToLatest() {
    await this.knex.migrate.latest()
    const version = await this.knex.migrate.currentVersion()
    this.migrated = true
    this.version = version
    this.logger.info('Migrations completed', { version })
  }

  async rollbackAll() {
    this.migrated = false
    this.version = null
    await this.knex.migrate.rollback(undefined, true)
  }

  async closeConnection() {
    await this.knex.destroy()
    this.logger.debug('Connection closed')
  }
}
