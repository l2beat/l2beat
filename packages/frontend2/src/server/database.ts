import { createRepositories } from '@l2beat/database'
import { env } from '~/env'

export const db = createRepositories({
  connectionString: env.DATABASE_URL,
  ssl:
    env.NODE_ENV === 'production' || env.DATABASE_URL.includes('amazonaws.com')
      ? { rejectUnauthorized: false }
      : undefined,
})
