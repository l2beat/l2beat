import { type Database, createDatabase } from '@l2beat/database'
import { env } from '~/env'

export const db = !env.MOCK
  ? createDatabase({
      connectionString: env.DATABASE_URL,
      ssl:
        env.NODE_ENV === 'production' ||
        env.DATABASE_URL.includes('amazonaws.com')
          ? { rejectUnauthorized: false }
          : undefined,
    })
  : createThrowingProxy()

function createThrowingProxy() {
  return new Proxy({} as Database, {
    get: () => {
      throw new Error(
        'DB has been called on mock! Report it to engineering team :)',
      )
    },
  })
}
