import { getEnv } from '@l2beat/backend-tools'
import { createTokenDatabase, type TokenDatabase } from '../tokenDatabase'

export function describeTokenDatabase(
  name: string,
  suite: (db: TokenDatabase) => void,
) {
  const database = getTestTokenDatabase()

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

function getTestTokenDatabase() {
  const env = getEnv()
  const connection = env.optionalString('TEST_DB_URL')
  if (!connection) {
    if (env.optionalString('CI') !== undefined) {
      throw new Error('TEST_DB_URL is required in CI')
    }
    return
  }

  const database = createTokenDatabase({
    connectionString: connection,
    application_name: 'Backend/Test',
  })

  return database
}
