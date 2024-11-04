import { createDatabase } from '@l2beat/database'
import { env } from './env'
export const db = createDatabase({
  connectionString: env.DATABASE_URL,
})
