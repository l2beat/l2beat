import { type Database, createDatabase } from '@l2beat/database'
import { env } from '~/env'

export const db = !env.MOCK
  ? createDatabase({
      application_name: createConnectionTag(),
      connectionString: env.DATABASE_URL,
      ssl: ssl(),
      ...pool(),
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

function createConnectionTag() {
  const base = 'l2beat-frontend'

  return `${base}-${env.NODE_ENV}`
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
