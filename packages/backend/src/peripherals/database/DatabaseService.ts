import KnexConstructor, { Knex } from 'knex'
import path from 'path'

import { Logger } from '../../tools/Logger'

export interface IDatabaseService {
  migrateToLatest(): Promise<void>
  rollbackAll(): Promise<void>
  closeConnection(): Promise<void>
}

export class DatabaseService implements IDatabaseService {
  constructor(private knex: Knex, private logger: Logger) {
    this.logger = this.logger.for(this)
  }

  static createKnexInstance(databaseUrl: string) {
    return KnexConstructor({
      client: 'pg',
      connection: databaseUrl,
      migrations: {
        directory: path.join(__dirname, '../../migrations'),
      },
    })
  }

  async migrateToLatest() {
    await this.knex.migrate.latest()
    const version = await this.knex.migrate.currentVersion()
    this.logger.info('Migrations completed', { version })
  }

  async rollbackAll() {
    await this.knex.migrate.rollback(undefined, true)
  }

  async closeConnection() {
    await this.knex.destroy()
  }
}
