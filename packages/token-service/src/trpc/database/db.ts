import { createTokenDatabase } from '@l2beat/database'

export const db = createTokenDatabase({
  connectionString: process.env['TEST_DB_URL'],
})
