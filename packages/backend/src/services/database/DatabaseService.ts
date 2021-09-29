import KnexConstructor, { Knex } from 'knex'
import path from 'path'

import { Logger } from '../Logger'

export class DatabaseService {
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

  async getAllTables() {
    const result = await this.knex.raw(
      'SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema()'
    )
    const rows: { table_name: string }[] = result.rows
    return rows.map((x) => x.table_name)
  }

  async closeConnection() {
    await this.knex.destroy()
  }
}
