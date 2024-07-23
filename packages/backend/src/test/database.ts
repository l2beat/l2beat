import { getEnv } from '@l2beat/backend-tools'
import { Database, Transaction, createDatabase } from '@l2beat/database'
import { mockObject } from 'earl'

export function describeDatabase(name: string, suite: (db: Database) => void) {
  const database = getTestDatabase()

  describe(name, function () {
    before(async function () {
      if (!database) {
        this.skip()
      }
    })

    if (database) {
      suite(database)
    } else {
      it.skip('Database tests skipped')
    }
  })
}

export function getTestDatabase() {
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

export const MOCK_TRX = mockObject<Transaction>()
export function mockDatabase(overrides: Partial<Database> = {}) {
  return mockObject<Database>({
    transaction: async (fun) => {
      return await fun(MOCK_TRX)
    },
    ...overrides,
  })
}
