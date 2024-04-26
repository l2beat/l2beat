import { getEnv, Logger } from '@l2beat/backend-tools'

import { DatabaseConfig } from '../config/Config'
import { Database } from '../peripherals/database/Database'

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

export function getTestDatabase(
  opts?: Partial<DatabaseConfig>,
): Database | undefined {
  const env = getEnv()
  const connection = env.optionalString('TEST_DB_URL')
  if (!connection) {
    if (process.env.CI !== undefined) {
      throw new Error('TEST_DB_URL is required in CI')
    }
    return
  }

  return new Database(
    {
      connection,
      connectionPoolSize: {
        min: 5,
        max: 20,
      },
      freshStart: false,
      enableQueryLogging: false,
      isReadonly: false,
      ...opts,
    },
    Logger.SILENT,
    'Backend/Test',
  )
}
