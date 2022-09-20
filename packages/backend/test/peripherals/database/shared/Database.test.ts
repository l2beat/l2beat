import { Logger } from '@l2beat/common'
import { expect } from 'earljs'
import { readdirSync } from 'fs'
import path from 'path'

import { getConfig } from '../../../../src/config'
import { Database } from '../../../../src/peripherals/database/shared/Database'

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

  it('migrations have consecutive numbering except for 20', () => {
    const migrationsDirectory = path.resolve(
      __dirname,
      '../../../../src/peripherals/database/migrations',
    )
    const fileNames = readdirSync(migrationsDirectory).sort()
    for (const [i, fileName] of fileNames.entries()) {
      const number = parseInt(fileName.slice(0, 3))
      // account for a past mistake at migration 20
      const expected = i >= 20 ? i : i + 1
      expect(number).toEqual(expected)
    }
  })
})
