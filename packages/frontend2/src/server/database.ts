import { createDatabase } from '@l2beat/database'
import { env } from '~/env'

export const db = createDatabase({
  connectionString: env.DATABASE_URL,
  ssl:
    env.NODE_ENV === 'production' || env.DATABASE_URL.includes('amazonaws.com')
      ? { rejectUnauthorized: false }
      : undefined,
})
