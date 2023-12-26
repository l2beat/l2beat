import { getEnv, Logger } from '@l2beat/backend-tools'

import { Database, DatabaseOpts } from '../peripherals/database/shared/Database'

export function setupDatabaseTestSuite() {
  const { database, skip } = getTestDatabase()

  before(async function () {
    if (skip) {
      this.skip()
    } else {
      await database.migrateToLatest()
    }
  })

  after(async () => {
    await database.closeConnection()
  })

  return { database }
}

export function getTestDatabase(opts?: DatabaseOpts) {
  const env = getEnv()
  const connection = env.optionalString('TEST_DB_URL')
  const database = new Database(connection, 'Backend/Test', Logger.SILENT, {
    ...opts,
    minConnectionPoolSize: 5,
    maxConnectionPoolSize: 20,
  })
  return {
    database,
    skip: connection === undefined,
  }
}
