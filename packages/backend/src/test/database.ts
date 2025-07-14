import { getEnv } from '@l2beat/backend-tools'
import { createDatabase, type Database } from '@l2beat/database'
import { mockObject } from 'earl'

export function describeDatabase(name: string, suite: (db: Database) => void) {
  const database = getTestDatabase()

  describe(name, function () {
    before(async function () {
      if (!database) {
        this.skip()
      }
    })

    after(async function () {
      await database?.close()
    })

    if (database) {
      suite(database)
    } else {
      it.skip('Database tests skipped')
    }
  })
}

function getTestDatabase() {
  const env = getEnv()
  const connection = env.optionalString('TEST_DB_URL')
  if (!connection) {
    if (env.optionalString('CI') !== undefined) {
      throw new Error('TEST_DB_URL is required in CI')
    }
    return
  }
  return createDatabase({
    connectionString: connection,
    application_name: 'Backend/Test',
  })
}

export function mockDatabase(overrides: Partial<Database> = {}) {
  return mockObject<Database>({
    transaction: async (fun) => {
      return await fun()
    },
    ...overrides,
  })
}
