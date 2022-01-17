import { expect } from 'earljs'

import { DatabaseService } from '../../../src/peripherals/database/DatabaseService'
import { Logger } from '../../../src/tools/Logger'
import { setupDatabaseTestSuite } from './setup'

describe('DatabaseService', () => {
  const { knex } = setupDatabaseTestSuite()

  it('can run and rollback all migrations', async () => {
    const databaseService = new DatabaseService(knex, Logger.SILENT)

    await databaseService.migrateToLatest()
    await databaseService.rollbackAll()

    const result = await knex.raw(
      'SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema()'
    )
    const tables = result.rows.map((x: { table_name: string }) => x.table_name)

    expect(tables).toEqual(['knex_migrations', 'knex_migrations_lock'])
  })
})
