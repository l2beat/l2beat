import { Logger } from '@l2beat/common'
import { expect } from 'earljs'

import { getConfig } from '../../../src/config'
import { Database } from '../../../src/peripherals/database/Database'

describe(Database.name, () => {
  it('can run and rollback all migrations', async function () {
    const config = getConfig('test')
    if (config.databaseConnection === 'xXTestDatabaseUrlXx') {
      this.skip()
    }
    const database = new Database(config.databaseConnection, Logger.SILENT)

    await database.migrateToLatest()
    await database.rollbackAll()

    const knex = await database.getKnex()
    const result = await knex.raw(
      'SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema()',
    )
    const tables = result.rows.map((x: { table_name: string }) => x.table_name)

    expect(tables).toEqual(['knex_migrations', 'knex_migrations_lock'])

    await database.closeConnection()
  })
})
