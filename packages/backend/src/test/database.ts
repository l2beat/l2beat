import { getEnv, Logger } from '@l2beat/backend-tools'

import { Database, DatabaseOpts } from '../peripherals/database/shared/Database'

export function describeDatabase(
  name: string,
  suite: (database: Database) => void,
) {
  const database = getTestDatabase()

  describe(name, function () {
    before(async function () {
      if (!database) {
        this.skip()
      } else {
        await database.migrateToLatest()
      }
    })

    after(async () => {
      await database?.closeConnection()
    })

    if (database) {
      suite(database)
    } else {
      it.skip('Database tests skipped')
    }
  })
}

export function getTestDatabase(opts?: DatabaseOpts): Database | undefined {
  const env = getEnv()
  const connection = env.optionalString('TEST_DB_URL')
  if (!connection) {
    if (process.env.CI !== undefined) {
      throw new Error('TEST_DB_URL is required in CI')
    }
    return
  }

  return new Database(connection, 'Backend/Test', Logger.SILENT, {
    ...opts,
    minConnectionPoolSize: 5,
    maxConnectionPoolSize: 20,
  })
}
