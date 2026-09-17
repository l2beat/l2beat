import { createDatabase, type Database } from '@l2beat/database'
import { mockObject } from '@l2beat/test-utils'
import { afterAll, describe, it } from 'vitest'
import { testDatabase } from './harness'

export function describeDatabase(name: string, suite: (db: Database) => void) {
  const connectionString = testDatabase.connectionString()
  if (!connectionString) {
    describe.skip(name, () => {
      it('needs TEST_DB_URL', () => {})
    })
    return
  }

  const database = createDatabase({
    connectionString,
    application_name: 'Backend/Test',
  })

  describe(name, () => {
    afterAll(async () => {
      await database.close()
    })

    suite(database)
  })
}

export function mockDatabase(overrides: Partial<Database> = {}): Database {
  return mockObject<Database>({
    transaction: async (fun) => {
      return await fun()
    },
    ...overrides,
  })
}
