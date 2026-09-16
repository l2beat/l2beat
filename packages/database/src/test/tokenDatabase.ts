import { afterAll, describe, it } from 'vitest'
import { createTokenDatabase, type TokenDatabase } from '../tokenDatabase'
import { testDatabase } from './harness'

export function describeTokenDatabase(
  name: string,
  suite: (db: TokenDatabase) => void,
) {
  const connectionString = testDatabase.connectionString()
  if (!connectionString) {
    describe.skip(name, () => {
      it('needs TEST_DB_URL', () => {})
    })
    return
  }

  const database = createTokenDatabase({
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
