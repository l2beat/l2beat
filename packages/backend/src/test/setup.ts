import { getLegacyTestDatabase } from '@l2beat/database-legacy'
import waitForExpect from 'wait-for-expect'

process.env.NODE_ENV = 'test'

waitForExpect.defaults.timeout = 1500
waitForExpect.defaults.interval = 10

before(async () => {
  const legacyDatabase = getLegacyTestDatabase()
  await legacyDatabase?.migrateToLatest()
  await legacyDatabase?.closeConnection()
})
