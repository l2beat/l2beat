import { readdirSync } from 'fs'
import path from 'path'
import { expect } from 'earl'
import { afterEach } from 'mocha'

import { getTestDatabase } from '../../test/database'
import { Database } from './Database'

describe(Database.name, () => {
  it('can run and rollback all migrations', async function () {
    const databases = getTestDatabase()
    if (!databases) {
      this.skip()
    }

    await databases.legacyDb.migrateToLatest()
    await databases.legacyDb.rollbackAll()

    const knex = await databases.legacyDb.getKnex()
    const result = await knex.raw(
      'SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema()',
    )
    const tables = result.rows.map((x: { table_name: string }) => x.table_name)

    expect(tables).toEqual(['knex_migrations', 'knex_migrations_lock'])

    await databases.legacyDb.closeConnection()
  })

  it('migrations have consecutive numbering except for 20', () => {
    const migrationsDirectory = path.resolve(__dirname, 'migrations')
    const fileNames = readdirSync(migrationsDirectory).sort()
    for (const [i, fileName] of fileNames.entries()) {
      const number = parseInt(fileName.slice(0, 3))
      // account for a past mistake at migration 20
      const expected = i >= 20 ? i : i + 1
      expect(number).toEqual(expected)
    }
  })

  describe(Database.prototype.assertRequiredServerVersion.name, () => {
    let database: Database | undefined

    afterEach(async () => {
      await database?.closeConnection()
    })

    it('throws for mismatching version', async function () {
      database = getTestDatabase({ requiredMajorVersion: 15 })?.legacyDb
      if (!database) {
        this.skip()
      }
      await expect(database.assertRequiredServerVersion()).toBeRejectedWith(
        'Assertion Error: Postgres server major version 14 different than required 15',
      )
    })

    it('does not throw for matching version', async function () {
      database = getTestDatabase()?.legacyDb
      if (!database) {
        this.skip()
      }
      await expect(database.assertRequiredServerVersion()).not.toBeRejected()
    })
  })
})
