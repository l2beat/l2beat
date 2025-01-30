import type { Database } from '@l2beat/database'
import { createDatabase } from '@l2beat/database'
import { env } from '~/env'

let db: Database | undefined

export function getDb() {
  if (!db) {
    db = !env.MOCK
      ? createDatabase({
          application_name: createConnectionTag(),
          connectionString: env.DATABASE_URL,
          ssl: ssl(),
          ...pool(),
        })
      : createThrowingProxy()
  }

  return db
}

function createThrowingProxy() {
  return new Proxy({} as Database, {
    get: () => {
      throw new Error(
        'DB has been called on mock! Report it to engineering team :)',
      )
    },
  })
}

// Tag is limited to 63 characters, so it will cut off the excess
function createConnectionTag() {
  const suffix = env.NODE_ENV === 'production' ? 'prod' : 'dev'
  const base = `FE-${suffix}`

  if (env.VERCEL_ENV === 'preview') {
    return `${base}-${env.VERCEL_GIT_COMMIT_REF}-${env.VERCEL_GIT_COMMIT_SHA}`
  }

  return base
}

function ssl() {
  return env.NODE_ENV === 'production' ||
    env.DATABASE_URL.includes('amazonaws.com')
    ? { rejectUnauthorized: false }
    : undefined
}

function pool() {
  if (env.NODE_ENV === 'production') {
    return {
      min: 2,
      max: 10,
    }
  }

  return {
    min: 2,
    max: 5,
  }
}
