import { expect } from 'chai'

import { DatabaseService } from '../../../src/peripherals/database/DatabaseService'
import { Logger } from '../../../src/tools/Logger'
import { setupDatabaseTestSuite } from './setup'

describe('DatabaseService', () => {
  const { knex } = setupDatabaseTestSuite()

  it('can run and rollback all migrations', async () => {
    const databaseService = new DatabaseService(knex, Logger.SILENT)

    await databaseService.migrateToLatest()
    await databaseService.rollbackAll()
    const tables = await databaseService.getAllTables()
    expect(tables).to.deep.equal(['knex_migrations', 'knex_migrations_lock'])
  })
})
