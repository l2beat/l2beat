import { createTokenDatabase, type TokenDatabase } from '@l2beat/database'
import { env } from '~/env'
import { createConnectionTag, makeDbLogger, pool } from './database'

let db: TokenDatabase | undefined

export function getTokenDb() {
  if (!db) {
    db = !env.MOCK
      ? createTokenDatabase({
          application_name: createConnectionTag(),
          connectionString: env.TOKENS_DATABASE_URL,
          ssl:
            env.NODE_ENV === 'production'
              ? { rejectUnauthorized: false }
              : undefined,
          ...pool(),
          log: env.TOKENS_DATABASE_LOG_ENABLED
            ? makeDbLogger('TokenDatabase')
            : undefined,
        })
      : createThrowingProxy()
  }
  return db
}

function createThrowingProxy() {
  return new Proxy({} as TokenDatabase, {
    get: () => {
      throw new Error(
        'TokenDB has been called on mock! Report it to engineering team :)',
      )
    },
  })
}
