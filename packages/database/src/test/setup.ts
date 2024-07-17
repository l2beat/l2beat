import { getLegacyTestDatabase } from '@l2beat/database-legacy'

process.env.NODE_ENV = 'test'

before(async () => {
  const legacyDatabase = getLegacyTestDatabase()
  await legacyDatabase?.migrateToLatest()
  await legacyDatabase?.closeConnection()
})
