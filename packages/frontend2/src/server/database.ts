import { createRepositories } from '@l2beat/database'
import { env } from '~/env'

export const db = createRepositories({
  connectionString: env.DATABASE_URL,
  // TODO: Remove this before merging
  ssl: { rejectUnauthorized: false },
})
